import { Vehicle } from "../../src/vehicle/domain/entities/vehicle.entity";
import { LicensePlate } from "../../src/vehicle/domain/value-objects/license-plate.vo";
import { CreateVehicleDto } from "../../src/vehicle/application/dto/create-vehicle.dto";
import { UpdateVehicleDto } from "../../src/vehicle/application/dto/update-vehicle.dto";

export const ownerCustomerId = "550e8400-e29b-41d4-a716-446655440000";

export function createVehicle(
  overrides: Partial<{
    id: string;
    licensePlate: string;
    make: string;
    model: string;
    year: number;
    color: string;
    customerId: string;
    active: boolean;
    createdAt: Date;
    updatedAt: Date;
  }> = {},
): Vehicle {
  return Vehicle.create({
    id: overrides.id ?? "550e8400-e29b-41d4-a716-446655440001",
    licensePlate: LicensePlate.create(overrides.licensePlate ?? "ABC-1234"),
    make: overrides.make ?? "Toyota",
    model: overrides.model ?? "Corolla",
    year: overrides.year ?? 2023,
    color: overrides.color ?? "White",
    customerId: overrides.customerId ?? ownerCustomerId,
    active: overrides.active,
    createdAt: overrides.createdAt ?? new Date("2024-01-01T00:00:00.000Z"),
    updatedAt: overrides.updatedAt ?? new Date("2024-01-02T00:00:00.000Z"),
  });
}

export function createVehicleDto(
  overrides: Partial<CreateVehicleDto> = {},
): CreateVehicleDto {
  return {
    licensePlate: "ABC-1234",
    make: "Toyota",
    model: "Corolla",
    year: 2023,
    color: "White",
    customerId: ownerCustomerId,
    ...overrides,
  };
}

export function updateVehicleDto(
  overrides: Partial<UpdateVehicleDto> = {},
): UpdateVehicleDto {
  return {
    make: "Honda",
    model: "Civic",
    year: 2024,
    color: "Black",
    ...overrides,
  };
}
