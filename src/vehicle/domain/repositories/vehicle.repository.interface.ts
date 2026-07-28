import { Vehicle } from "../entities/vehicle.entity";
import { VehicleFilters } from "./vehicle-filters.interface";

export interface VehicleRepository {
  findById(id: string): Promise<Vehicle | null>;
  findByLicensePlate(licensePlate: string): Promise<Vehicle | null>;
  findByCustomerId(customerId: string): Promise<Vehicle[]>;
  findAll(filters?: VehicleFilters): Promise<Vehicle[]>;
  save(vehicle: Vehicle): Promise<Vehicle>;
  delete(id: string): Promise<void>;
}
