import { randomUUID } from "node:crypto";
import { DomainException } from "../../../common/exceptions/domain.exception";
import { Address } from "../value-objects/address.vo";
import { Document } from "../value-objects/document.vo";
import { EmailInvalidException } from "../exceptions/email-invalid.exception";

interface CustomerProps {
  id?: string;
  name: string;
  document: Document;
  email: string;
  phone: string;
  address: Address;
  active?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface UpdateCustomerProps {
  name?: string;
  email?: string;
  phone?: string;
  address?: Address;
}

export class Customer {
  private readonly customerId: string;
  private customerName: string;
  private readonly customerDocument: Document;
  private customerEmail: string;
  private customerPhone: string;
  private customerAddress: Address;
  private customerActive: boolean;
  private readonly customerCreatedAt: Date;
  private customerUpdatedAt: Date;

  private constructor(props: CustomerProps) {
    this.customerId = props.id ?? randomUUID();
    this.customerName = props.name;
    this.customerDocument = props.document;
    this.customerEmail = props.email;
    this.customerPhone = props.phone;
    this.customerAddress = props.address;
    this.customerActive = props.active ?? true;
    this.customerCreatedAt = props.createdAt ?? new Date();
    this.customerUpdatedAt = props.updatedAt ?? new Date();

    this.validate();
  }

  static create(props: CustomerProps): Customer {
    return new Customer(props);
  }

  update(props: UpdateCustomerProps): void {
    if (props.name !== undefined) {
      this.validateName(props.name);
      this.customerName = props.name;
    }

    if (props.email !== undefined) {
      this.validateEmail(props.email);
      this.customerEmail = props.email;
    }

    if (props.phone !== undefined) {
      this.validatePhone(props.phone);
      this.customerPhone = props.phone;
    }

    if (props.address !== undefined) {
      this.customerAddress = props.address;
    }

    this.customerUpdatedAt = new Date();
  }

  activate(): void {
    this.customerActive = true;
    this.customerUpdatedAt = new Date();
  }

  deactivate(): void {
    this.customerActive = false;
    this.customerUpdatedAt = new Date();
  }

  private validate(): void {
    this.validateName(this.customerName);
    this.validateEmail(this.customerEmail);
    this.validatePhone(this.customerPhone);

    if (!this.customerDocument) {
      throw new DomainException("DOCUMENT_REQUIRED", "Document is required.");
    }
    if (!this.customerAddress) {
      throw new DomainException("ADDRESS_REQUIRED", "Address is required.");
    }
  }

  private validateName(name: string): void {
    if (!name?.trim()) {
      throw new DomainException("NAME_REQUIRED", "Name is required.");
    }
    if (name.trim().length < 3) {
      throw new DomainException(
        "NAME_INVALID",
        "Name must have at least 3 characters.",
      );
    }
  }

  private validateEmail(email: string): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      throw new EmailInvalidException(email);
    }
  }

  private validatePhone(phone: string): void {
    if (!phone?.trim()) {
      throw new DomainException("PHONE_REQUIRED", "Phone is required.");
    }
  }

  get id(): string {
    return this.customerId;
  }

  get name(): string {
    return this.customerName;
  }

  get document(): Document {
    return this.customerDocument;
  }

  get email(): string {
    return this.customerEmail;
  }

  get phone(): string {
    return this.customerPhone;
  }

  get address(): Address {
    return this.customerAddress;
  }

  get active(): boolean {
    return this.customerActive;
  }

  get createdAt(): Date {
    return this.customerCreatedAt;
  }

  get updatedAt(): Date {
    return this.customerUpdatedAt;
  }
}
