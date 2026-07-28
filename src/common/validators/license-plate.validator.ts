import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from "class-validator";

const LEGACY_PLATE_PATTERN = /^[A-Z]{3}-?\d{4}$/;
const MERCOSUR_PLATE_PATTERN = /^[A-Z]{3}\d[A-Z]\d{2}$/;

export function normalizeLicensePlate(value: string): string {
  return value.trim().toUpperCase();
}

export function isValidLicensePlate(value: string): boolean {
  const plate = normalizeLicensePlate(value);
  return LEGACY_PLATE_PATTERN.test(plate) || MERCOSUR_PLATE_PATTERN.test(plate);
}

@ValidatorConstraint({ async: false })
export class IsLicensePlateConstraint implements ValidatorConstraintInterface {
  validate(value: unknown): boolean {
    return typeof value === "string" && isValidLicensePlate(value);
  }

  defaultMessage(): string {
    return "License plate must follow ABC-1234 or ABC1D23 format.";
  }
}

export function IsLicensePlate(validationOptions?: ValidationOptions) {
  return function registerLicensePlateValidator(
    object: object,
    propertyName: string,
  ): void {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsLicensePlateConstraint,
    });
  };
}
