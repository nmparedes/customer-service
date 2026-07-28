import { DomainException } from "../../../common/exceptions/domain.exception";

export class VehicleAlreadyExistsException extends DomainException {
  constructor(licensePlate: string) {
    super("VEHICLE_ALREADY_EXISTS", "Vehicle already exists.", {
      licensePlate,
    });
  }
}
