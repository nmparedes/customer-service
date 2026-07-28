import { randomUUID } from "node:crypto";
import { DomainException } from "../../../common/exceptions/domain.exception";
import { YearInvalidException } from "../exceptions/year-invalid.exception";
import { LicensePlate } from "../value-objects/license-plate.vo";

interface CreateVehicleProps {
  licensePlate: LicensePlate;
  make: string;
  model: string;
  year: number;
  color?: string;
  customerId: string;
}

interface VehicleProps extends CreateVehicleProps {
  id?: string;
  active?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface UpdateVehicleProps {
  make?: string;
  model?: string;
  year?: number;
  color?: string;
}

export class Vehicle {
  private readonly vehicleId: string;
  private readonly vehicleLicensePlate: LicensePlate;
  private vehicleMake: string;
  private vehicleModel: string;
  private vehicleYear: number;
  private vehicleColor: string;
  private readonly vehicleCustomerId: string;
  private vehicleActive: boolean;
  private readonly vehicleCreatedAt: Date;
  private vehicleUpdatedAt: Date;

  private constructor(props: VehicleProps) {
    this.vehicleId = props.id ?? randomUUID();
    this.vehicleLicensePlate = props.licensePlate;
    this.vehicleMake = props.make;
    this.vehicleModel = props.model;
    this.vehicleYear = props.year;
    this.vehicleColor = props.color ?? "";
    this.vehicleCustomerId = props.customerId;
    this.vehicleActive = props.active ?? true;
    this.vehicleCreatedAt = props.createdAt ?? new Date();
    this.vehicleUpdatedAt = props.updatedAt ?? new Date();

    this.validate();
  }

  static create(props: VehicleProps): Vehicle {
    return new Vehicle(props);
  }

  update(props: UpdateVehicleProps): void {
    if (props.make !== undefined) {
      this.validateMake(props.make);
      this.vehicleMake = props.make;
    }
    if (props.model !== undefined) {
      this.validateModel(props.model);
      this.vehicleModel = props.model;
    }
    if (props.year !== undefined) {
      this.validateYear(props.year);
      this.vehicleYear = props.year;
    }
    if (props.color !== undefined) {
      this.vehicleColor = props.color;
    }

    this.vehicleUpdatedAt = new Date();
  }

  activate(): void {
    this.vehicleActive = true;
    this.vehicleUpdatedAt = new Date();
  }

  deactivate(): void {
    this.vehicleActive = false;
    this.vehicleUpdatedAt = new Date();
  }

  private validate(): void {
    this.validateMake(this.vehicleMake);
    this.validateModel(this.vehicleModel);
    this.validateYear(this.vehicleYear);

    if (!this.vehicleLicensePlate) {
      throw new DomainException(
        "LICENSE_PLATE_REQUIRED",
        "License plate is required.",
      );
    }
    if (!this.vehicleCustomerId?.trim()) {
      throw new DomainException(
        "CUSTOMER_ID_REQUIRED",
        "Customer ID is required.",
      );
    }
  }

  private validateMake(make: string): void {
    if (!make?.trim()) {
      throw new DomainException("MAKE_REQUIRED", "Make is required.");
    }
    if (make.trim().length < 2) {
      throw new DomainException(
        "MAKE_INVALID",
        "Make must have at least 2 characters.",
      );
    }
  }

  private validateModel(model: string): void {
    if (!model?.trim()) {
      throw new DomainException("MODEL_REQUIRED", "Model is required.");
    }
  }

  private validateYear(year: number): void {
    if (!Number.isInteger(year)) {
      throw new DomainException("YEAR_REQUIRED", "Year must be an integer.");
    }

    const currentYear = new Date().getFullYear();
    if (year < 1900 || year > currentYear + 1) {
      throw new YearInvalidException(year);
    }
  }

  get id(): string {
    return this.vehicleId;
  }

  get licensePlate(): LicensePlate {
    return this.vehicleLicensePlate;
  }

  get make(): string {
    return this.vehicleMake;
  }

  get model(): string {
    return this.vehicleModel;
  }

  get year(): number {
    return this.vehicleYear;
  }

  get color(): string {
    return this.vehicleColor;
  }

  get customerId(): string {
    return this.vehicleCustomerId;
  }

  get active(): boolean {
    return this.vehicleActive;
  }

  get createdAt(): Date {
    return this.vehicleCreatedAt;
  }

  get updatedAt(): Date {
    return this.vehicleUpdatedAt;
  }
}
