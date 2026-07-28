import { Customer } from "../entities/customer.entity";
import { CustomerFilters } from "./customer-filters.interface";

export interface CustomerRepository {
  save(customer: Customer): Promise<Customer>;
  findById(id: string): Promise<Customer | null>;
  findByDocument(document: string): Promise<Customer | null>;
  findAll(filters?: CustomerFilters): Promise<Customer[]>;
  delete(id: string): Promise<void>;
}
