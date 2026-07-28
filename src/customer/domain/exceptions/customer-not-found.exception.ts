import { DomainException } from "../../../common/exceptions/domain.exception";

export class CustomerNotFoundException extends DomainException {
  constructor(identifier: string) {
    super("CUSTOMER_NOT_FOUND", "Customer was not found.", {
      identifier,
    });
  }
}
