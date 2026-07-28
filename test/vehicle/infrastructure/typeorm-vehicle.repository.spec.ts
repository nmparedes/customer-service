import { getRepositoryToken } from "@nestjs/typeorm";
import { Test } from "@nestjs/testing";
import { Repository, SelectQueryBuilder } from "typeorm";
import { Vehicle } from "../../../src/vehicle/domain/entities/vehicle.entity";
import { TypeOrmVehicleRepository } from "../../../src/vehicle/infrastructure/repositories/typeorm-vehicle.repository";
import { VehicleMapper } from "../../../src/vehicle/infrastructure/mappers/vehicle.mapper";
import { VehicleOrmEntity } from "../../../src/vehicle/infrastructure/typeorm/vehicle.orm-entity";
import { createVehicle, ownerCustomerId } from "../vehicle.factory";

describe("TypeOrmVehicleRepository", () => {
  let repository: TypeOrmVehicleRepository;
  let ormRepository: jest.Mocked<Repository<VehicleOrmEntity>>;
  let queryBuilder: jest.Mocked<SelectQueryBuilder<VehicleOrmEntity>>;

  beforeEach(async () => {
    queryBuilder = {
      andWhere: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      offset: jest.fn().mockReturnThis(),
      getMany: jest.fn(),
    } as unknown as jest.Mocked<SelectQueryBuilder<VehicleOrmEntity>>;

    ormRepository = {
      save: jest.fn(),
      findOne: jest.fn(),
      find: jest.fn(),
      createQueryBuilder: jest.fn().mockReturnValue(queryBuilder),
      update: jest.fn(),
    } as unknown as jest.Mocked<Repository<VehicleOrmEntity>>;

    const moduleRef = await Test.createTestingModule({
      providers: [
        TypeOrmVehicleRepository,
        {
          provide: getRepositoryToken(VehicleOrmEntity),
          useValue: ormRepository,
        },
      ],
    }).compile();

    repository = moduleRef.get(TypeOrmVehicleRepository);
  });

  it("saves vehicles", async () => {
    const vehicle = createVehicle();
    ormRepository.save.mockResolvedValue(VehicleMapper.toOrmEntity(vehicle));

    const result = await repository.save(vehicle);

    expect(ormRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({ id: vehicle.id, make: vehicle.make }),
    );
    expect(result).toBeInstanceOf(Vehicle);
  });

  it("finds active vehicles by id, license plate and customer id", async () => {
    const vehicle = createVehicle();
    const ormEntity = VehicleMapper.toOrmEntity(vehicle);
    ormRepository.findOne.mockResolvedValue(ormEntity);
    ormRepository.find.mockResolvedValue([ormEntity]);

    await expect(repository.findById(vehicle.id)).resolves.toBeInstanceOf(
      Vehicle,
    );
    await expect(
      repository.findByLicensePlate("abc-1234"),
    ).resolves.toBeInstanceOf(Vehicle);
    await expect(
      repository.findByCustomerId(ownerCustomerId),
    ).resolves.toHaveLength(1);
    expect(ormRepository.findOne).toHaveBeenCalledWith({
      where: { id: vehicle.id, active: true },
    });
    expect(ormRepository.findOne).toHaveBeenCalledWith({
      where: { license_plate: "ABC1234", active: true },
    });
    expect(ormRepository.find).toHaveBeenCalledWith({
      where: { customer_id: ownerCustomerId, active: true },
    });
  });

  it("returns null for missing vehicles", async () => {
    ormRepository.findOne.mockResolvedValue(null);

    await expect(repository.findById("missing")).resolves.toBeNull();
    await expect(repository.findByLicensePlate("ABC1234")).resolves.toBeNull();
  });

  it("applies filters, ordering and pagination", async () => {
    queryBuilder.getMany.mockResolvedValue([
      VehicleMapper.toOrmEntity(createVehicle()),
    ]);

    const result = await repository.findAll({
      licensePlate: "abc-1234",
      make: "Toyota",
      model: "Corolla",
      year: 2023,
      minimumYear: 2020,
      maximumYear: 2024,
      customerId: ownerCustomerId,
      active: false,
      orderBy: "licensePlate",
      order: "ASC",
      page: 2,
      limit: 10,
    });

    expect(ormRepository.createQueryBuilder).toHaveBeenCalledWith("vehicle");
    expect(queryBuilder.andWhere).toHaveBeenCalledWith(
      "vehicle.license_plate LIKE :licensePlate",
      { licensePlate: "%ABC1234%" },
    );
    expect(queryBuilder.andWhere).toHaveBeenCalledWith(
      "LOWER(vehicle.make) LIKE LOWER(:make)",
      { make: "%Toyota%" },
    );
    expect(queryBuilder.andWhere).toHaveBeenCalledWith(
      "LOWER(vehicle.model) LIKE LOWER(:model)",
      { model: "%Corolla%" },
    );
    expect(queryBuilder.andWhere).toHaveBeenCalledWith("vehicle.year = :year", {
      year: 2023,
    });
    expect(queryBuilder.andWhere).toHaveBeenCalledWith(
      "vehicle.year >= :minimumYear",
      { minimumYear: 2020 },
    );
    expect(queryBuilder.andWhere).toHaveBeenCalledWith(
      "vehicle.year <= :maximumYear",
      { maximumYear: 2024 },
    );
    expect(queryBuilder.andWhere).toHaveBeenCalledWith(
      "vehicle.customer_id = :customerId",
      { customerId: ownerCustomerId },
    );
    expect(queryBuilder.andWhere).toHaveBeenCalledWith(
      "vehicle.active = :active",
      { active: false },
    );
    expect(queryBuilder.orderBy).toHaveBeenCalledWith(
      "vehicle.license_plate",
      "ASC",
    );
    expect(queryBuilder.limit).toHaveBeenCalledWith(10);
    expect(queryBuilder.offset).toHaveBeenCalledWith(10);
    expect(result).toHaveLength(1);
  });

  it("uses default ordering, supports other order fields and soft deletes", async () => {
    queryBuilder.getMany.mockResolvedValue([]);
    ormRepository.update.mockResolvedValue({
      affected: 1,
      raw: [],
      generatedMaps: [],
    });

    await repository.findAll();
    await repository.findAll({ orderBy: "make" });
    await repository.findAll({ orderBy: "year" });
    await repository.delete("vehicle-1");

    expect(queryBuilder.orderBy).toHaveBeenCalledWith(
      "vehicle.created_at",
      "DESC",
    );
    expect(queryBuilder.orderBy).toHaveBeenCalledWith("vehicle.make", "DESC");
    expect(queryBuilder.orderBy).toHaveBeenCalledWith("vehicle.year", "DESC");
    expect(ormRepository.update).toHaveBeenCalledWith("vehicle-1", {
      active: false,
    });
  });
});
