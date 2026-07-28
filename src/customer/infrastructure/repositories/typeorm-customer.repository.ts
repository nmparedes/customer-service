import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Customer } from "../../domain/entities/customer.entity";
import { CustomerFilters } from "../../domain/repositories/customer-filters.interface";
import { CustomerRepository } from "../../domain/repositories/customer.repository.interface";
import { CustomerMapper } from "../mappers/customer.mapper";
import { CustomerOrmEntity } from "../typeorm/customer.orm-entity";

@Injectable()
export class TypeOrmCustomerRepository implements CustomerRepository {
  constructor(
    @InjectRepository(CustomerOrmEntity)
    private readonly repository: Repository<CustomerOrmEntity>,
  ) {}

  async save(customer: Customer): Promise<Customer> {
    const savedEntity = await this.repository.save(
      CustomerMapper.toOrmEntity(customer),
    );
    return CustomerMapper.toDomain(savedEntity);
  }

  async findById(id: string): Promise<Customer | null> {
    const ormEntity = await this.repository.findOne({ where: { id } });
    return ormEntity ? CustomerMapper.toDomain(ormEntity) : null;
  }

  async findByDocument(document: string): Promise<Customer | null> {
    const ormEntity = await this.repository.findOne({
      where: { document_value: document },
    });
    return ormEntity ? CustomerMapper.toDomain(ormEntity) : null;
  }

  async findAll(filters?: CustomerFilters): Promise<Customer[]> {
    const queryBuilder = this.repository.createQueryBuilder("customer");

    if (filters?.name) {
      queryBuilder.andWhere("customer.name LIKE :name", {
        name: `%${filters.name}%`,
      });
    }

    if (filters?.document) {
      queryBuilder.andWhere("customer.document_value = :document", {
        document: filters.document,
      });
    }

    if (filters?.active !== undefined) {
      queryBuilder.andWhere("customer.active = :active", {
        active: filters.active,
      });
    }

    const orderBy = filters?.orderBy ?? "createdAt";
    const order = filters?.order ?? "DESC";
    queryBuilder.orderBy(
      orderBy === "name" ? "customer.name" : "customer.created_at",
      order,
    );

    if (filters?.limit) {
      queryBuilder.limit(filters.limit);
    }

    if (filters?.page && filters?.limit) {
      queryBuilder.offset((filters.page - 1) * filters.limit);
    }

    return CustomerMapper.toDomainList(await queryBuilder.getMany());
  }

  async delete(id: string): Promise<void> {
    await this.repository.update(id, { active: false });
  }
}
