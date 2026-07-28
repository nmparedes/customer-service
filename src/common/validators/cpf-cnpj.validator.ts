import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from "class-validator";

export function sanitizeDocument(value: string): string {
  return value.replace(/\D/g, "");
}

export function isValidCpf(value: string): boolean {
  const cpf = sanitizeDocument(value);
  if (!/^\d{11}$/.test(cpf) || /^(\d)\1+$/.test(cpf)) {
    return false;
  }

  const firstDigit = calculateCpfDigit(cpf.slice(0, 9));
  const secondDigit = calculateCpfDigit(`${cpf.slice(0, 9)}${firstDigit}`);
  return cpf.endsWith(`${firstDigit}${secondDigit}`);
}

export function isValidCnpj(value: string): boolean {
  const cnpj = sanitizeDocument(value);
  if (!/^\d{14}$/.test(cnpj) || /^(\d)\1+$/.test(cnpj)) {
    return false;
  }

  const firstDigit = calculateCnpjDigit(cnpj.slice(0, 12));
  const secondDigit = calculateCnpjDigit(`${cnpj.slice(0, 12)}${firstDigit}`);
  return cnpj.endsWith(`${firstDigit}${secondDigit}`);
}

export function isValidCpfOrCnpj(value: string): boolean {
  return isValidCpf(value) || isValidCnpj(value);
}

@ValidatorConstraint({ async: false })
export class IsCpfOrCnpjConstraint implements ValidatorConstraintInterface {
  validate(value: unknown): boolean {
    return typeof value === "string" && isValidCpfOrCnpj(value);
  }

  defaultMessage(): string {
    return "Document must be a valid CPF or CNPJ.";
  }
}

export function IsCpfOrCnpj(validationOptions?: ValidationOptions) {
  return function registerCpfOrCnpjValidator(
    object: object,
    propertyName: string,
  ): void {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsCpfOrCnpjConstraint,
    });
  };
}

function calculateCpfDigit(partialCpf: string): number {
  const weightStart = partialCpf.length + 1;
  const sum = partialCpf
    .split("")
    .reduce(
      (total, digit, index) => total + Number(digit) * (weightStart - index),
      0,
    );
  const remainder = (sum * 10) % 11;
  return remainder === 10 ? 0 : remainder;
}

function calculateCnpjDigit(partialCnpj: string): number {
  const weights =
    partialCnpj.length === 12
      ? [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
      : [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const sum = partialCnpj
    .split("")
    .reduce((total, digit, index) => total + Number(digit) * weights[index], 0);
  const remainder = sum % 11;
  return remainder < 2 ? 0 : 11 - remainder;
}
