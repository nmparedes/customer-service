import { DomainException } from "../../../common/exceptions/domain.exception";

export class EmailInvalidException extends DomainException {
  constructor(email: string) {
    super("EMAIL_INVALID", "Email is invalid.", {
      email,
    });
  }
}
