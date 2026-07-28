import { DomainException } from "../../../common/exceptions/domain.exception";

export class VehicleNotFoundException extends DomainException {
  constructor(identifier: string) {
    super("VEHICLE_NOT_FOUND", "Vehicle was not found.", {
      identifier,
    });
  }
}
