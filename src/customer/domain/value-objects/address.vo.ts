import { DomainException } from "../../../common/exceptions/domain.exception";

export interface AddressProps {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
}

export class Address {
  private constructor(private readonly props: AddressProps) {
    this.validate();
  }

  static create(props: AddressProps): Address {
    return new Address(props);
  }

  private validate(): void {
    if (!this.props.street?.trim()) {
      throw new DomainException("STREET_REQUIRED", "Street is required.");
    }
    if (!this.props.number?.trim()) {
      throw new DomainException("NUMBER_REQUIRED", "Number is required.");
    }
    if (!this.props.neighborhood?.trim()) {
      throw new DomainException(
        "NEIGHBORHOOD_REQUIRED",
        "Neighborhood is required.",
      );
    }
    if (!this.props.city?.trim()) {
      throw new DomainException("CITY_REQUIRED", "City is required.");
    }
    if (!this.props.state || this.props.state.trim().length !== 2) {
      throw new DomainException(
        "STATE_INVALID",
        "State must have exactly two characters.",
      );
    }
    if (!this.props.zipCode || !this.isValidZipCode(this.props.zipCode)) {
      throw new DomainException("ZIP_CODE_INVALID", "Zip code is invalid.");
    }
  }

  private isValidZipCode(zipCode: string): boolean {
    return zipCode.replace(/\D/g, "").length === 8;
  }

  get street(): string {
    return this.props.street;
  }

  get number(): string {
    return this.props.number;
  }

  get complement(): string | undefined {
    return this.props.complement;
  }

  get neighborhood(): string {
    return this.props.neighborhood;
  }

  get city(): string {
    return this.props.city;
  }

  get state(): string {
    return this.props.state;
  }

  get zipCode(): string {
    return this.props.zipCode;
  }

  format(): string {
    const complement = this.props.complement
      ? `, ${this.props.complement}`
      : "";
    return `${this.props.street}, ${this.props.number}${complement}, ${this.props.neighborhood}, ${this.props.city} - ${this.props.state}, ZIP: ${this.props.zipCode}`;
  }

  equals(other: Address | null | undefined): boolean {
    return Boolean(
      other &&
      this.props.street === other.props.street &&
      this.props.number === other.props.number &&
      this.props.complement === other.props.complement &&
      this.props.neighborhood === other.props.neighborhood &&
      this.props.city === other.props.city &&
      this.props.state === other.props.state &&
      this.props.zipCode === other.props.zipCode,
    );
  }
}
