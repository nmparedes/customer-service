import { Vehicle } from "../../../src/vehicle/domain/entities/vehicle.entity";
import { VehicleMapper } from "../../../src/vehicle/infrastructure/mappers/vehicle.mapper";
import { VehicleOrmEntity } from "../../../src/vehicle/infrastructure/typeorm/vehicle.orm-entity";
import { createVehicle, ownerCustomerId } from "../vehicle.factory";

describe("VehicleMapper", () => {
  const ormEntity = {
    id: "vehicle-1",
    license_plate: "ABC1234",
    make: "Toyota",
    model: "Corolla",
    year: 2023,
    color: "White",
    customer_id: ownerCustomerId,
    active: true,
    created_at: new Date("2024-01-01T00:00:00.000Z"),
    updated_at: new Date("2024-01-02T00:00:00.000Z"),
  } as VehicleOrmEntity;

  it("maps ORM entities to domain entities", () => {
    const vehicle = VehicleMapper.toDomain(ormEntity);

    expect(vehicle).toBeInstanceOf(Vehicle);
    expect(vehicle.id).toBe("vehicle-1");
    expect(vehicle.licensePlate.rawValue).toBe("ABC1234");
    expect(vehicle.color).toBe("White");
  });

  it("maps null color to empty domain color", () => {
    const vehicle = VehicleMapper.toDomain({ ...ormEntity, color: null });

    expect(vehicle.color).toBe("");
  });

  it("maps domain entities to ORM entities", () => {
    const vehicle = createVehicle({ id: "vehicle-1" });
    const mapped = VehicleMapper.toOrmEntity(vehicle);

    expect(mapped).toBeInstanceOf(VehicleOrmEntity);
    expect(mapped.id).toBe("vehicle-1");
    expect(mapped.license_plate).toBe("ABC1234");
    expect(mapped.customer_id).toBe(ownerCustomerId);
    expect(mapped.active).toBe(true);
  });

  it("maps lists", () => {
    expect(VehicleMapper.toDomainList([ormEntity])).toHaveLength(1);
    expect(VehicleMapper.toDomainList([])).toEqual([]);
  });
});
