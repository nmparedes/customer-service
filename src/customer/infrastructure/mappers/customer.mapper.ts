import { Customer } from "../../domain/entities/customer.entity";
import { Address } from "../../domain/value-objects/address.vo";
import { Document } from "../../domain/value-objects/document.vo";
import { CustomerOrmEntity } from "../typeorm/customer.orm-entity";

export class CustomerMapper {
  static toDomain(ormEntity: CustomerOrmEntity): Customer {
    return Customer.create({
      id: ormEntity.id,
      name: ormEntity.name,
      document: Document.create(ormEntity.document_value),
      email: ormEntity.email,
      phone: ormEntity.phone,
      address: Address.create({
        street: ormEntity.address_street,
        number: ormEntity.address_number,
        complement: ormEntity.address_complement ?? undefined,
        neighborhood: ormEntity.address_neighborhood,
        city: ormEntity.address_city,
        state: ormEntity.address_state,
        zipCode: ormEntity.address_zip_code,
      }),
      active: ormEntity.active,
      createdAt: ormEntity.created_at,
      updatedAt: ormEntity.updated_at,
    });
  }

  static toOrmEntity(customer: Customer): CustomerOrmEntity {
    const ormEntity = new CustomerOrmEntity();

    ormEntity.id = customer.id;
    ormEntity.name = customer.name;
    ormEntity.document_type = customer.document.documentType;
    ormEntity.document_value = customer.document.rawValue;
    ormEntity.email = customer.email;
    ormEntity.phone = customer.phone;
    ormEntity.address_street = customer.address.street;
    ormEntity.address_number = customer.address.number;
    ormEntity.address_complement = customer.address.complement ?? null;
    ormEntity.address_neighborhood = customer.address.neighborhood;
    ormEntity.address_city = customer.address.city;
    ormEntity.address_state = customer.address.state;
    ormEntity.address_zip_code = customer.address.zipCode;
    ormEntity.active = customer.active;
    ormEntity.created_at = customer.createdAt;
    ormEntity.updated_at = customer.updatedAt;

    return ormEntity;
  }

  static toDomainList(ormEntities: CustomerOrmEntity[]): Customer[] {
    return ormEntities.map((ormEntity) => this.toDomain(ormEntity));
  }
}
