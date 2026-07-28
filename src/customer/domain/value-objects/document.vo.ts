import {
  isValidCnpj,
  isValidCpf,
  sanitizeDocument,
} from "../../../common/validators/cpf-cnpj.validator";
import { DocumentType } from "../enums/document-type.enum";
import { DocumentInvalidException } from "../exceptions/document-invalid.exception";

export class Document {
  private constructor(
    private readonly value: string,
    private readonly type: DocumentType,
  ) {}

  static create(value: string): Document {
    const sanitizedValue = sanitizeDocument(value);

    if (!this.isValid(sanitizedValue)) {
      throw new DocumentInvalidException(
        value,
        "CPF or CNPJ has invalid format or check digits.",
      );
    }

    return new Document(sanitizedValue, this.detectType(sanitizedValue));
  }

  static isValid(value: string): boolean {
    const sanitizedValue = sanitizeDocument(value);
    if (sanitizedValue.length === 11) {
      return isValidCpf(sanitizedValue);
    }
    if (sanitizedValue.length === 14) {
      return isValidCnpj(sanitizedValue);
    }
    return false;
  }

  static detectType(value: string): DocumentType {
    const sanitizedValue = sanitizeDocument(value);
    if (sanitizedValue.length === 11) {
      return DocumentType.CPF;
    }
    if (sanitizedValue.length === 14) {
      return DocumentType.CNPJ;
    }
    throw new DocumentInvalidException(
      value,
      "Document must have 11 CPF digits or 14 CNPJ digits.",
    );
  }

  get rawValue(): string {
    return this.value;
  }

  get documentType(): DocumentType {
    return this.type;
  }

  format(): string {
    if (this.type === DocumentType.CPF) {
      return this.value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    }

    return this.value.replace(
      /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
      "$1.$2.$3/$4-$5",
    );
  }

  equals(other: Document | null | undefined): boolean {
    return Boolean(
      other && this.value === other.value && this.type === other.type,
    );
  }
}
