import { Inject, Injectable } from "@nestjs/common";
import { PaginatedResponse } from "../../../common/interfaces/paginated-response.interface";
import { CUSTOMER_REPOSITORY } from "../../../customer/customer.tokens";
import { CustomerNotFoundException } from "../../../customer/domain/exceptions/customer-not-found.exception";
import type { CustomerRepository } from "../../../customer/domain/repositories/customer.repository.interface";
import { VEHICLE_REPOSITORY } from "../../vehicle.tokens";
import { Vehicle } from "../../domain/entities/vehicle.entity";
import { VehicleAlreadyExistsException } from "../../domain/exceptions/vehicle-already-exists.exception";
import { VehicleNotFoundException } from "../../domain/exceptions/vehicle-not-found.exception";
import { VehicleFilters } from "../../domain/repositories/vehicle-filters.interface";
import type { VehicleRepository } from "../../domain/repositories/vehicle.repository.interface";
import { LicensePlate } from "../../domain/value-objects/license-plate.vo";
import { CreateVehicleDto } from "../dto/create-vehicle.dto";
import { UpdateVehicleDto } from "../dto/update-vehicle.dto";
import { VehicleResponseDto } from "../dto/vehicle-response.dto";

@Injectable()
export class VehicleService {
  constructor(
    @Inject(VEHICLE_REPOSITORY)
    private readonly vehicleRepository: VehicleRepository,
    @Inject(CUSTOMER_REPOSITORY)
    private readonly customerRepository: CustomerRepository,
  ) {}

  async create(dto: CreateVehicleDto): Promise<VehicleResponseDto> {
    const customer = await this.customerRepository.findById(dto.customerId);
    if (!customer) {
      throw new CustomerNotFoundException(dto.customerId);
    }

    const normalizedLicensePlate = this.normalizeLicensePlate(dto.licensePlate);
    const existingVehicle = await this.vehicleRepository.findByLicensePlate(
      normalizedLicensePlate,
    );
    if (existingVehicle) {
      throw new VehicleAlreadyExistsException(dto.licensePlate);
    }

    const vehicle = Vehicle.create({
      licensePlate: LicensePlate.create(dto.licensePlate),
      make: dto.make,
      model: dto.model,
      year: dto.year,
      color: dto.color,
      customerId: dto.customerId,
    });

    return this.toResponseDto(
      await this.vehicleRepository.save(vehicle),
      customer,
    );
  }

  async findById(id: string): Promise<VehicleResponseDto> {
    const vehicle = await this.vehicleRepository.findById(id);
    if (!vehicle) {
      throw new VehicleNotFoundException(id);
    }

    const customer = await this.customerRepository.findById(vehicle.customerId);
    return this.toResponseDto(vehicle, customer ?? undefined);
  }

  async findByLicensePlate(licensePlate: string): Promise<VehicleResponseDto> {
    const normalizedLicensePlate = this.normalizeLicensePlate(licensePlate);
    const vehicle = await this.vehicleRepository.findByLicensePlate(
      normalizedLicensePlate,
    );
    if (!vehicle) {
      throw new VehicleNotFoundException(licensePlate);
    }

    const customer = await this.customerRepository.findById(vehicle.customerId);
    return this.toResponseDto(vehicle, customer ?? undefined);
  }

  async findByCustomerId(customerId: string): Promise<VehicleResponseDto[]> {
    const customer = await this.customerRepository.findById(customerId);
    if (!customer) {
      throw new CustomerNotFoundException(customerId);
    }

    const vehicles = await this.vehicleRepository.findByCustomerId(customerId);
    return vehicles.map((vehicle) => this.toResponseDto(vehicle, customer));
  }

  async findAll(
    filters: VehicleFilters,
  ): Promise<PaginatedResponse<VehicleResponseDto>> {
    const page = filters.page ?? 1;
    const limit = filters.limit ?? 10;
    const normalizedFilters = {
      ...filters,
      licensePlate: filters.licensePlate
        ? this.normalizeLicensePlate(filters.licensePlate)
        : undefined,
      page,
      limit,
    };

    const vehicles = await this.vehicleRepository.findAll(normalizedFilters);
    const allVehicles = await this.vehicleRepository.findAll({
      licensePlate: normalizedFilters.licensePlate,
      make: filters.make,
      model: filters.model,
      year: filters.year,
      minimumYear: filters.minimumYear,
      maximumYear: filters.maximumYear,
      customerId: filters.customerId,
      active: filters.active,
      orderBy: filters.orderBy,
      order: filters.order,
    });

    const customersById = new Map<
      string,
      Awaited<ReturnType<CustomerRepository["findById"]>>
    >();
    for (const vehicle of vehicles) {
      if (!customersById.has(vehicle.customerId)) {
        customersById.set(
          vehicle.customerId,
          await this.customerRepository.findById(vehicle.customerId),
        );
      }
    }

    return {
      data: vehicles.map((vehicle) =>
        this.toResponseDto(
          vehicle,
          customersById.get(vehicle.customerId) ?? undefined,
        ),
      ),
      meta: {
        total: allVehicles.length,
        page,
        limit,
        totalPages: Math.ceil(allVehicles.length / limit),
      },
    };
  }

  async update(id: string, dto: UpdateVehicleDto): Promise<VehicleResponseDto> {
    const vehicle = await this.vehicleRepository.findById(id);
    if (!vehicle) {
      throw new VehicleNotFoundException(id);
    }

    vehicle.update({
      make: dto.make,
      model: dto.model,
      year: dto.year,
      color: dto.color,
    });

    const updatedVehicle = await this.vehicleRepository.save(vehicle);
    const customer = await this.customerRepository.findById(
      updatedVehicle.customerId,
    );
    return this.toResponseDto(updatedVehicle, customer ?? undefined);
  }

  async delete(id: string): Promise<void> {
    const vehicle = await this.vehicleRepository.findById(id);
    if (!vehicle) {
      throw new VehicleNotFoundException(id);
    }

    vehicle.deactivate();
    await this.vehicleRepository.save(vehicle);
  }

  private normalizeLicensePlate(licensePlate: string): string {
    return licensePlate.trim().toUpperCase().replace(/-/g, "");
  }

  private toResponseDto(
    vehicle: Vehicle,
    customer?: Awaited<ReturnType<CustomerRepository["findById"]>>,
  ): VehicleResponseDto {
    return {
      id: vehicle.id,
      licensePlate: vehicle.licensePlate.rawValue,
      formattedLicensePlate: vehicle.licensePlate.format(),
      licensePlateType: vehicle.licensePlate.plateType,
      make: vehicle.make,
      model: vehicle.model,
      year: vehicle.year,
      color: vehicle.color || undefined,
      customerId: vehicle.customerId,
      customer: customer
        ? {
            id: customer.id,
            name: customer.name,
          }
        : undefined,
      active: vehicle.active,
      createdAt: vehicle.createdAt,
      updatedAt: vehicle.updatedAt,
    };
  }
}
