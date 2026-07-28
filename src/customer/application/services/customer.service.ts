import { Inject, Injectable } from "@nestjs/common";
import { PaginatedResponse } from "../../../common/interfaces/paginated-response.interface";
import { CUSTOMER_REPOSITORY } from "../../customer.tokens";
import { Customer } from "../../domain/entities/customer.entity";
import { CustomerAlreadyExistsException } from "../../domain/exceptions/customer-already-exists.exception";
import { CustomerNotFoundException } from "../../domain/exceptions/customer-not-found.exception";
import { CustomerFilters } from "../../domain/repositories/customer-filters.interface";
import type { CustomerRepository } from "../../domain/repositories/customer.repository.interface";
import { Address } from "../../domain/value-objects/address.vo";
import { Document } from "../../domain/value-objects/document.vo";
import { CreateCustomerDto } from "../dto/create-customer.dto";
import { CustomerResponseDto } from "../dto/customer-response.dto";
import { UpdateCustomerDto } from "../dto/update-customer.dto";

@Injectable()
export class CustomerService {
  constructor(
    @Inject(CUSTOMER_REPOSITORY)
    private readonly customerRepository: CustomerRepository,
  ) {}

  async create(dto: CreateCustomerDto): Promise<CustomerResponseDto> {
    const sanitizedDocument = dto.document.replace(/\D/g, "");
    const existingCustomer =
      await this.customerRepository.findByDocument(sanitizedDocument);

    if (existingCustomer) {
      throw new CustomerAlreadyExistsException(dto.document);
    }

    const customer = Customer.create({
      name: dto.name,
      document: Document.create(dto.document),
      email: dto.email,
      phone: dto.phone,
      address: this.createAddress(dto.address),
    });

    return this.toResponseDto(await this.customerRepository.save(customer));
  }

  async findById(id: string): Promise<CustomerResponseDto> {
    const customer = await this.customerRepository.findById(id);
    if (!customer) {
      throw new CustomerNotFoundException(id);
    }
    return this.toResponseDto(customer);
  }

  async findByDocument(document: string): Promise<CustomerResponseDto> {
    const sanitizedDocument = document.replace(/\D/g, "");
    const customer =
      await this.customerRepository.findByDocument(sanitizedDocument);
    if (!customer) {
      throw new CustomerNotFoundException(document);
    }
    return this.toResponseDto(customer);
  }

  async findAll(
    filters: CustomerFilters,
  ): Promise<PaginatedResponse<CustomerResponseDto>> {
    const page = filters.page ?? 1;
    const limit = filters.limit ?? 10;
    const normalizedFilters = {
      ...filters,
      document: filters.document?.replace(/\D/g, ""),
      page,
      limit,
    };
    const customers = await this.customerRepository.findAll(normalizedFilters);
    const allCustomers = await this.customerRepository.findAll({
      name: filters.name,
      document: filters.document?.replace(/\D/g, ""),
      active: filters.active,
    });

    return {
      data: customers.map((customer) => this.toResponseDto(customer)),
      meta: {
        total: allCustomers.length,
        page,
        limit,
        totalPages: Math.ceil(allCustomers.length / limit),
      },
    };
  }

  async update(
    id: string,
    dto: UpdateCustomerDto,
  ): Promise<CustomerResponseDto> {
    const customer = await this.customerRepository.findById(id);
    if (!customer) {
      throw new CustomerNotFoundException(id);
    }

    customer.update({
      name: dto.name,
      email: dto.email,
      phone: dto.phone,
      address: dto.address ? this.createAddress(dto.address) : undefined,
    });

    return this.toResponseDto(await this.customerRepository.save(customer));
  }

  async delete(id: string): Promise<void> {
    const customer = await this.customerRepository.findById(id);
    if (!customer) {
      throw new CustomerNotFoundException(id);
    }
    await this.customerRepository.delete(id);
  }

  private createAddress(dto: CreateCustomerDto["address"]): Address {
    return Address.create({
      street: dto.street,
      number: dto.number,
      complement: dto.complement,
      neighborhood: dto.neighborhood,
      city: dto.city,
      state: dto.state,
      zipCode: dto.zipCode,
    });
  }

  private toResponseDto(customer: Customer): CustomerResponseDto {
    return {
      id: customer.id,
      name: customer.name,
      document: customer.document.rawValue,
      formattedDocument: customer.document.format(),
      documentType: customer.document.documentType,
      email: customer.email,
      phone: customer.phone,
      address: {
        street: customer.address.street,
        number: customer.address.number,
        complement: customer.address.complement,
        neighborhood: customer.address.neighborhood,
        city: customer.address.city,
        state: customer.address.state,
        zipCode: customer.address.zipCode,
      },
      active: customer.active,
      createdAt: customer.createdAt,
      updatedAt: customer.updatedAt,
    };
  }
}
