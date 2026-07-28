import { Vehicle } from "../../domain/entities/vehicle.entity";
import { LicensePlate } from "../../domain/value-objects/license-plate.vo";
import { VehicleOrmEntity } from "../typeorm/vehicle.orm-entity";

export class VehicleMapper {
  static toDomain(ormEntity: VehicleOrmEntity): Vehicle {
    return Vehicle.create({
      id: ormEntity.id,
      licensePlate: LicensePlate.create(ormEntity.license_plate),
      make: ormEntity.make,
      model: ormEntity.model,
      year: ormEntity.year,
      color: ormEntity.color ?? undefined,
      customerId: ormEntity.customer_id,
      active: ormEntity.active,
      createdAt: ormEntity.created_at,
      updatedAt: ormEntity.updated_at,
    });
  }

  static toOrmEntity(vehicle: Vehicle): VehicleOrmEntity {
    const ormEntity = new VehicleOrmEntity();

    ormEntity.id = vehicle.id;
    ormEntity.license_plate = vehicle.licensePlate.rawValue;
    ormEntity.make = vehicle.make;
    ormEntity.model = vehicle.model;
    ormEntity.year = vehicle.year;
    ormEntity.color = vehicle.color || null;
    ormEntity.customer_id = vehicle.customerId;
    ormEntity.active = vehicle.active;
    ormEntity.created_at = vehicle.createdAt;
    ormEntity.updated_at = vehicle.updatedAt;

    return ormEntity;
  }

  static toDomainList(ormEntities: VehicleOrmEntity[]): Vehicle[] {
    return ormEntities.map((ormEntity) => this.toDomain(ormEntity));
  }
}
