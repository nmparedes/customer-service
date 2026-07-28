import { DomainException } from "../../../common/exceptions/domain.exception";

export class DocumentInvalidException extends DomainException {
  constructor(document: string, reason = "CPF or CNPJ is invalid.") {
    super("DOCUMENT_INVALID", reason, {
      document,
    });
  }
}
