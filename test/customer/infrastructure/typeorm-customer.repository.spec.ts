import { getRepositoryToken } from "@nestjs/typeorm";
import { Test } from "@nestjs/testing";
import { Repository, SelectQueryBuilder } from "typeorm";
import { Customer } from "../../../src/customer/domain/entities/customer.entity";
import { CustomerMapper } from "../../../src/customer/infrastructure/mappers/customer.mapper";
import { TypeOrmCustomerRepository } from "../../../src/customer/infrastructure/repositories/typeorm-customer.repository";
import { CustomerOrmEntity } from "../../../src/customer/infrastructure/typeorm/customer.orm-entity";
import { createCustomer } from "../customer.factory";

describe("TypeOrmCustomerRepository", () => {
  let repository: TypeOrmCustomerRepository;
  let ormRepository: jest.Mocked<Repository<CustomerOrmEntity>>;
  let queryBuilder: jest.Mocked<SelectQueryBuilder<CustomerOrmEntity>>;

  beforeEach(async () => {
    queryBuilder = {
      andWhere: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      offset: jest.fn().mockReturnThis(),
      getMany: jest.fn(),
    } as unknown as jest.Mocked<SelectQueryBuilder<CustomerOrmEntity>>;

    ormRepository = {
      save: jest.fn(),
      findOne: jest.fn(),
      createQueryBuilder: jest.fn().mockReturnValue(queryBuilder),
      update: jest.fn(),
    } as unknown as jest.Mocked<Repository<CustomerOrmEntity>>;

    const moduleRef = await Test.createTestingModule({
      providers: [
        TypeOrmCustomerRepository,
        {
          provide: getRepositoryToken(CustomerOrmEntity),
          useValue: ormRepository,
        },
      ],
    }).compile();

    repository = moduleRef.get(TypeOrmCustomerRepository);
  });

  it("saves customers", async () => {
    const customer = createCustomer();
    ormRepository.save.mockResolvedValue(CustomerMapper.toOrmEntity(customer));

    const result = await repository.save(customer);

    expect(ormRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({ id: customer.id, name: customer.name }),
    );
    expect(result).toBeInstanceOf(Customer);
  });

  it("finds customers by id and document", async () => {
    const customer = createCustomer();
    const ormEntity = CustomerMapper.toOrmEntity(customer);
    ormRepository.findOne.mockResolvedValue(ormEntity);

    await expect(repository.findById(customer.id)).resolves.toBeInstanceOf(
      Customer,
    );
    await expect(
      repository.findByDocument(customer.document.rawValue),
    ).resolves.toBeInstanceOf(Customer);
    expect(ormRepository.findOne).toHaveBeenCalledWith({
      where: { id: customer.id },
    });
    expect(ormRepository.findOne).toHaveBeenCalledWith({
      where: { document_value: customer.document.rawValue },
    });
  });

  it("returns null for missing customers", async () => {
    ormRepository.findOne.mockResolvedValue(null);

    await expect(repository.findById("missing")).resolves.toBeNull();
    await expect(repository.findByDocument("52998224725")).resolves.toBeNull();
  });

  it("applies filters, ordering and pagination", async () => {
    const customer = createCustomer();
    queryBuilder.getMany.mockResolvedValue([
      CustomerMapper.toOrmEntity(customer),
    ]);

    const result = await repository.findAll({
      name: "Joao",
      document: "52998224725",
      active: false,
      orderBy: "name",
      order: "ASC",
      page: 2,
      limit: 10,
    });

    expect(ormRepository.createQueryBuilder).toHaveBeenCalledWith("customer");
    expect(queryBuilder.andWhere).toHaveBeenCalledWith(
      "customer.name LIKE :name",
      { name: "%Joao%" },
    );
    expect(queryBuilder.andWhere).toHaveBeenCalledWith(
      "customer.document_value = :document",
      { document: "52998224725" },
    );
    expect(queryBuilder.andWhere).toHaveBeenCalledWith(
      "customer.active = :active",
      { active: false },
    );
    expect(queryBuilder.orderBy).toHaveBeenCalledWith("customer.name", "ASC");
    expect(queryBuilder.limit).toHaveBeenCalledWith(10);
    expect(queryBuilder.offset).toHaveBeenCalledWith(10);
    expect(result).toHaveLength(1);
  });

  it("uses default createdAt ordering and soft deletes customers", async () => {
    queryBuilder.getMany.mockResolvedValue([]);
    ormRepository.update.mockResolvedValue({
      affected: 1,
      raw: [],
      generatedMaps: [],
    });

    await expect(repository.findAll()).resolves.toEqual([]);
    await repository.delete("customer-1");

    expect(queryBuilder.orderBy).toHaveBeenCalledWith(
      "customer.created_at",
      "DESC",
    );
    expect(ormRepository.update).toHaveBeenCalledWith("customer-1", {
      active: false,
    });
  });
});
