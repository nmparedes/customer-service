import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Vehicle } from "../../domain/entities/vehicle.entity";
import { VehicleFilters } from "../../domain/repositories/vehicle-filters.interface";
import { VehicleRepository } from "../../domain/repositories/vehicle.repository.interface";
import { VehicleMapper } from "../mappers/vehicle.mapper";
import { VehicleOrmEntity } from "../typeorm/vehicle.orm-entity";

@Injectable()
export class TypeOrmVehicleRepository implements VehicleRepository {
  constructor(
    @InjectRepository(VehicleOrmEntity)
    private readonly repository: Repository<VehicleOrmEntity>,
  ) {}

  async save(vehicle: Vehicle): Promise<Vehicle> {
    const savedEntity = await this.repository.save(
      VehicleMapper.toOrmEntity(vehicle),
    );
    return VehicleMapper.toDomain(savedEntity);
  }

  async findById(id: string): Promise<Vehicle | null> {
    const ormEntity = await this.repository.findOne({
      where: { id, active: true },
    });
    return ormEntity ? VehicleMapper.toDomain(ormEntity) : null;
  }

  async findByLicensePlate(licensePlate: string): Promise<Vehicle | null> {
    const ormEntity = await this.repository.findOne({
      where: {
        license_plate: this.normalizeLicensePlate(licensePlate),
        active: true,
      },
    });
    return ormEntity ? VehicleMapper.toDomain(ormEntity) : null;
  }

  async findByCustomerId(customerId: string): Promise<Vehicle[]> {
    const ormEntities = await this.repository.find({
      where: { customer_id: customerId, active: true },
    });
    return VehicleMapper.toDomainList(ormEntities);
  }

  async findAll(filters?: VehicleFilters): Promise<Vehicle[]> {
    const queryBuilder = this.repository.createQueryBuilder("vehicle");

    if (filters?.licensePlate) {
      queryBuilder.andWhere("vehicle.license_plate LIKE :licensePlate", {
        licensePlate: `%${this.normalizeLicensePlate(filters.licensePlate)}%`,
      });
    }

    if (filters?.make) {
      queryBuilder.andWhere("LOWER(vehicle.make) LIKE LOWER(:make)", {
        make: `%${filters.make}%`,
      });
    }

    if (filters?.model) {
      queryBuilder.andWhere("LOWER(vehicle.model) LIKE LOWER(:model)", {
        model: `%${filters.model}%`,
      });
    }

    if (filters?.year !== undefined) {
      queryBuilder.andWhere("vehicle.year = :year", { year: filters.year });
    }

    if (filters?.minimumYear !== undefined) {
      queryBuilder.andWhere("vehicle.year >= :minimumYear", {
        minimumYear: filters.minimumYear,
      });
    }

    if (filters?.maximumYear !== undefined) {
      queryBuilder.andWhere("vehicle.year <= :maximumYear", {
        maximumYear: filters.maximumYear,
      });
    }

    if (filters?.customerId) {
      queryBuilder.andWhere("vehicle.customer_id = :customerId", {
        customerId: filters.customerId,
      });
    }

    if (filters?.active !== undefined) {
      queryBuilder.andWhere("vehicle.active = :active", {
        active: filters.active,
      });
    }

    const orderByColumn = this.resolveOrderByColumn(
      filters?.orderBy ?? "createdAt",
    );
    queryBuilder.orderBy(orderByColumn, filters?.order ?? "DESC");

    if (filters?.limit) {
      queryBuilder.limit(filters.limit);
    }
    if (filters?.page && filters?.limit) {
      queryBuilder.offset((filters.page - 1) * filters.limit);
    }

    return VehicleMapper.toDomainList(await queryBuilder.getMany());
  }

  async delete(id: string): Promise<void> {
    await this.repository.update(id, { active: false });
  }

  private normalizeLicensePlate(licensePlate: string): string {
    return licensePlate.trim().toUpperCase().replace(/-/g, "");
  }

  private resolveOrderByColumn(orderBy: VehicleFilters["orderBy"]): string {
    switch (orderBy) {
      case "licensePlate":
        return "vehicle.license_plate";
      case "make":
        return "vehicle.make";
      case "year":
        return "vehicle.year";
      default:
        return "vehicle.created_at";
    }
  }
}
