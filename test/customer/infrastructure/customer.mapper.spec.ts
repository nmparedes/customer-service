import { Customer } from "../../../src/customer/domain/entities/customer.entity";
import { CustomerMapper } from "../../../src/customer/infrastructure/mappers/customer.mapper";
import { CustomerOrmEntity } from "../../../src/customer/infrastructure/typeorm/customer.orm-entity";
import { createCustomer } from "../customer.factory";

describe("CustomerMapper", () => {
  const ormEntity = {
    id: "customer-1",
    name: "Joao Silva",
    document_type: "CPF",
    document_value: "52998224725",
    email: "joao@example.com",
    phone: "11987654321",
    address_street: "Rua Principal",
    address_number: "123",
    address_complement: "Apt 42",
    address_neighborhood: "Centro",
    address_city: "Sao Paulo",
    address_state: "SP",
    address_zip_code: "01234-567",
    active: true,
    created_at: new Date("2024-01-01T00:00:00.000Z"),
    updated_at: new Date("2024-01-02T00:00:00.000Z"),
  } as CustomerOrmEntity;

  it("maps ORM entities to domain entities", () => {
    const customer = CustomerMapper.toDomain(ormEntity);

    expect(customer).toBeInstanceOf(Customer);
    expect(customer.id).toBe("customer-1");
    expect(customer.document.rawValue).toBe("52998224725");
    expect(customer.address.complement).toBe("Apt 42");
  });

  it("maps null complement to undefined", () => {
    const customer = CustomerMapper.toDomain({
      ...ormEntity,
      address_complement: null,
    });

    expect(customer.address.complement).toBeUndefined();
  });

  it("maps domain entities to ORM entities", () => {
    const customer = createCustomer({ id: "customer-1" });
    const mapped = CustomerMapper.toOrmEntity(customer);

    expect(mapped).toBeInstanceOf(CustomerOrmEntity);
    expect(mapped.id).toBe("customer-1");
    expect(mapped.document_value).toBe("52998224725");
    expect(mapped.address_complement).toBe("Apt 45");
    expect(mapped.active).toBe(true);
  });

  it("maps lists", () => {
    expect(CustomerMapper.toDomainList([ormEntity])).toHaveLength(1);
    expect(CustomerMapper.toDomainList([])).toEqual([]);
  });
});
