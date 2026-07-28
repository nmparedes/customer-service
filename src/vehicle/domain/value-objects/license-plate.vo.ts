import {
  isValidLicensePlate,
  normalizeLicensePlate,
} from "../../../common/validators/license-plate.validator";
import { LicensePlateType } from "../enums/license-plate-type.enum";
import { LicensePlateInvalidException } from "../exceptions/license-plate-invalid.exception";

export class LicensePlate {
  private constructor(
    private readonly value: string,
    private readonly type: LicensePlateType,
  ) {}

  static create(value: string): LicensePlate {
    if (!value || typeof value !== "string") {
      throw new LicensePlateInvalidException(
        value,
        "License plate must be a non-empty string.",
      );
    }

    const normalizedInput = normalizeLicensePlate(value);
    if (!isValidLicensePlate(normalizedInput)) {
      throw new LicensePlateInvalidException(
        value,
        "License plate must follow ABC-1234 or ABC1D23 format.",
      );
    }

    const normalizedValue = normalizedInput.replace("-", "");
    return new LicensePlate(normalizedValue, this.detectType(normalizedValue));
  }

  static isValid(value: string): boolean {
    return typeof value === "string" && isValidLicensePlate(value);
  }

  static detectType(value: string): LicensePlateType {
    const normalizedValue = normalizeLicensePlate(value).replace("-", "");
    if (/^[A-Z]{3}\d[A-Z]\d{2}$/.test(normalizedValue)) {
      return LicensePlateType.MERCOSUR;
    }
    if (/^[A-Z]{3}\d{4}$/.test(normalizedValue)) {
      return LicensePlateType.LEGACY;
    }
    throw new LicensePlateInvalidException(
      value,
      "License plate must follow ABC-1234 or ABC1D23 format.",
    );
  }

  get rawValue(): string {
    return this.value;
  }

  get plateType(): LicensePlateType {
    return this.type;
  }

  format(): string {
    if (this.type === LicensePlateType.LEGACY) {
      return this.value.replace(/^([A-Z]{3})(\d{4})$/, "$1-$2");
    }
    return this.value;
  }

  equals(other: LicensePlate | null | undefined): boolean {
    return Boolean(
      other && this.value === other.value && this.type === other.type,
    );
  }
}
