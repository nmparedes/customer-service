import { DomainException } from "../../../src/common/exceptions/domain.exception";
import { Customer } from "../../../src/customer/domain/entities/customer.entity";
import { DocumentType } from "../../../src/customer/domain/enums/document-type.enum";
import { DocumentInvalidException } from "../../../src/customer/domain/exceptions/document-invalid.exception";
import { EmailInvalidException } from "../../../src/customer/domain/exceptions/email-invalid.exception";
import { Document } from "../../../src/customer/domain/value-objects/document.vo";
import {
  createAddress,
  createCustomer,
  validAddressProps,
} from "../customer.factory";

describe("Document", () => {
  it("creates and formats valid CPF and CNPJ documents", () => {
    const cpf = Document.create("529.982.247-25");
    const cnpj = Document.create("04.252.011/0001-10");

    expect(cpf.rawValue).toBe("52998224725");
    expect(cpf.documentType).toBe(DocumentType.CPF);
    expect(cpf.format()).toBe("529.982.247-25");
    expect(cnpj.rawValue).toBe("04252011000110");
    expect(cnpj.documentType).toBe(DocumentType.CNPJ);
    expect(cnpj.format()).toBe("04.252.011/0001-10");
    expect(cpf.equals(Document.create("52998224725"))).toBe(true);
    expect(cpf.equals(cnpj)).toBe(false);
    expect(cpf.equals(null)).toBe(false);
  });

  it("rejects invalid documents and invalid document sizes", () => {
    expect(Document.isValid("11111111111")).toBe(false);
    expect(() => Document.create("11111111111")).toThrow(
      DocumentInvalidException,
    );
    expect(() => Document.detectType("123")).toThrow(DocumentInvalidException);
  });
});

describe("Address", () => {
  it("creates, formats and compares valid addresses", () => {
    const address = createAddress();

    expect(address.street).toBe(validAddressProps.street);
    expect(address.number).toBe(validAddressProps.number);
    expect(address.complement).toBe(validAddressProps.complement);
    expect(address.format()).toContain("Rua das Flores, 123");
    expect(address.equals(createAddress())).toBe(true);
    expect(address.equals(createAddress({ number: "456" }))).toBe(false);
    expect(address.equals(undefined)).toBe(false);
  });

  it("rejects missing or invalid required fields", () => {
    expect(() => createAddress({ street: "" })).toThrow(DomainException);
    expect(() => createAddress({ number: "" })).toThrow(DomainException);
    expect(() => createAddress({ neighborhood: "" })).toThrow(DomainException);
    expect(() => createAddress({ city: "" })).toThrow(DomainException);
    expect(() => createAddress({ state: "SPA" })).toThrow(DomainException);
    expect(() => createAddress({ zipCode: "123" })).toThrow(DomainException);
  });
});

describe("Customer", () => {
  it("creates, updates, activates and deactivates customers", () => {
    const customer = createCustomer({ active: false });
    const originalDocument = customer.document;
    const originalCreatedAt = customer.createdAt;

    customer.activate();
    expect(customer.active).toBe(true);

    customer.update({
      name: "Maria Silva",
      email: "maria@example.com",
      phone: "11999999999",
      address: createAddress({ street: "Avenida Paulista" }),
    });

    expect(customer.name).toBe("Maria Silva");
    expect(customer.email).toBe("maria@example.com");
    expect(customer.phone).toBe("11999999999");
    expect(customer.address.street).toBe("Avenida Paulista");
    expect(customer.document).toBe(originalDocument);
    expect(customer.createdAt).toBe(originalCreatedAt);

    customer.deactivate();
    expect(customer.active).toBe(false);
  });

  it("rejects invalid customer data", () => {
    expect(() => createCustomer({ name: "" })).toThrow(DomainException);
    expect(() => createCustomer({ name: "Jo" })).toThrow(DomainException);
    expect(() => createCustomer({ email: "invalid" })).toThrow(
      EmailInvalidException,
    );
    expect(() => createCustomer({ phone: "" })).toThrow(DomainException);

    const customer = createCustomer();
    expect(() => customer.update({ name: "" })).toThrow(DomainException);
    expect(() => customer.update({ email: "invalid" })).toThrow(
      EmailInvalidException,
    );
    expect(() => customer.update({ phone: "" })).toThrow(DomainException);
  });

  it("requires document and address", () => {
    expect(() =>
      Customer.create({
        name: "Joao Silva",
        document: undefined as never,
        email: "joao@example.com",
        phone: "11987654321",
        address: createAddress(),
      }),
    ).toThrow(DomainException);

    expect(() =>
      Customer.create({
        name: "Joao Silva",
        document: Document.create("52998224725"),
        email: "joao@example.com",
        phone: "11987654321",
        address: undefined as never,
      }),
    ).toThrow(DomainException);
  });
});
