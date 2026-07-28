import { DomainException } from "../../../common/exceptions/domain.exception";

export class CustomerAlreadyExistsException extends DomainException {
  constructor(document: string) {
    super("CUSTOMER_ALREADY_EXISTS", "Customer already exists.", {
      document,
    });
  }
}
