import { Customer } from "../../src/customer/domain/entities/customer.entity";
import {
  Address,
  AddressProps,
} from "../../src/customer/domain/value-objects/address.vo";
import { Document } from "../../src/customer/domain/value-objects/document.vo";
import { CreateCustomerDto } from "../../src/customer/application/dto/create-customer.dto";
import { UpdateCustomerDto } from "../../src/customer/application/dto/update-customer.dto";

export const validAddressProps: AddressProps = {
  street: "Rua das Flores",
  number: "123",
  complement: "Apt 45",
  neighborhood: "Centro",
  city: "Sao Paulo",
  state: "SP",
  zipCode: "01310-100",
};

export function createAddress(overrides: Partial<AddressProps> = {}): Address {
  return Address.create({
    ...validAddressProps,
    ...overrides,
  });
}

export function createCustomer(
  overrides: Partial<{
    id: string;
    name: string;
    document: string;
    email: string;
    phone: string;
    address: Address;
    active: boolean;
    createdAt: Date;
    updatedAt: Date;
  }> = {},
): Customer {
  return Customer.create({
    id: overrides.id ?? "550e8400-e29b-41d4-a716-446655440000",
    name: overrides.name ?? "Joao Silva",
    document: Document.create(overrides.document ?? "52998224725"),
    email: overrides.email ?? "joao@example.com",
    phone: overrides.phone ?? "11987654321",
    address: overrides.address ?? createAddress(),
    active: overrides.active,
    createdAt: overrides.createdAt ?? new Date("2024-01-01T00:00:00.000Z"),
    updatedAt: overrides.updatedAt ?? new Date("2024-01-02T00:00:00.000Z"),
  });
}

export function createCustomerDto(
  overrides: Partial<CreateCustomerDto> = {},
): CreateCustomerDto {
  return {
    name: "Joao Silva",
    document: "529.982.247-25",
    email: "joao@example.com",
    phone: "11987654321",
    address: validAddressProps,
    ...overrides,
  };
}

export function updateCustomerDto(
  overrides: Partial<UpdateCustomerDto> = {},
): UpdateCustomerDto {
  return {
    name: "Maria Silva",
    email: "maria@example.com",
    phone: "11999999999",
    address: {
      ...validAddressProps,
      street: "Avenida Paulista",
      number: "1000",
    },
    ...overrides,
  };
}
