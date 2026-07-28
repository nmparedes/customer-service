import "reflect-metadata";
import {
  isValidCnpj,
  isValidCpf,
  isValidCpfOrCnpj,
  IsCpfOrCnpjConstraint,
  sanitizeDocument,
} from "../../src/common/validators/cpf-cnpj.validator";
import {
  isValidLicensePlate,
  IsLicensePlateConstraint,
  normalizeLicensePlate,
} from "../../src/common/validators/license-plate.validator";

describe("document validators", () => {
  it("validates CPF and CNPJ documents", () => {
    expect(sanitizeDocument("529.982.247-25")).toBe("52998224725");
    expect(isValidCpf("529.982.247-25")).toBe(true);
    expect(isValidCpf("111.111.111-11")).toBe(false);
    expect(isValidCpf("123")).toBe(false);
    expect(isValidCnpj("04.252.011/0001-10")).toBe(true);
    expect(isValidCnpj("11.111.111/1111-11")).toBe(false);
    expect(isValidCpfOrCnpj("04.252.011/0001-10")).toBe(true);
  });

  it("supports class-validator constraint objects", () => {
    const documentConstraint = new IsCpfOrCnpjConstraint();

    expect(documentConstraint.validate("529.982.247-25")).toBe(true);
    expect(documentConstraint.validate("invalid")).toBe(false);
    expect(documentConstraint.validate(123)).toBe(false);
    expect(documentConstraint.defaultMessage()).toContain("CPF or CNPJ");
  });
});

describe("license plate validators", () => {
  it("validates legacy and Mercosur plates", () => {
    expect(normalizeLicensePlate(" abc-1234 ")).toBe("ABC-1234");
    expect(isValidLicensePlate("ABC-1234")).toBe(true);
    expect(isValidLicensePlate("ABC1234")).toBe(true);
    expect(isValidLicensePlate("ABC1D23")).toBe(true);
    expect(isValidLicensePlate("ABCD123")).toBe(false);
  });

  it("supports class-validator constraint objects", () => {
    const plateConstraint = new IsLicensePlateConstraint();

    expect(plateConstraint.validate("ABC1D23")).toBe(true);
    expect(plateConstraint.validate("invalid")).toBe(false);
    expect(plateConstraint.validate(123)).toBe(false);
    expect(plateConstraint.defaultMessage()).toContain("License plate");
  });
});
