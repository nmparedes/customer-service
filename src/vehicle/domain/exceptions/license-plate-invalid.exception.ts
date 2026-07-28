import { DomainException } from "../../../common/exceptions/domain.exception";

export class LicensePlateInvalidException extends DomainException {
  constructor(licensePlate: unknown, reason = "License plate is invalid.") {
    super("LICENSE_PLATE_INVALID", reason, {
      licensePlate,
    });
  }
}
