import "reflect-metadata";
import { CustomerController } from "../../../src/customer/infrastructure/controllers/customer.controller";
import { CustomerService } from "../../../src/customer/application/services/customer.service";
import { IS_PUBLIC_KEY } from "../../../src/auth/decorators/public.decorator";
import {
  createCustomer,
  createCustomerDto,
  updateCustomerDto,
} from "../customer.factory";
import { createCustomerStatusResponse } from "../customer.response.factory";

describe("CustomerController", () => {
  let service: jest.Mocked<CustomerService>;
  let controller: CustomerController;

  beforeEach(() => {
    const customer = createCustomer();
    const response = {
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
    const statusResponse = createCustomerStatusResponse();

    service = {
      create: jest.fn().mockResolvedValue(response),
      findAll: jest.fn().mockResolvedValue({ data: [response], meta: {} }),
      findByDocument: jest.fn().mockResolvedValue(response),
      findStatusByDocument: jest.fn().mockResolvedValue(statusResponse),
      findById: jest.fn().mockResolvedValue(response),
      update: jest.fn().mockResolvedValue(response),
      delete: jest.fn().mockResolvedValue(undefined),
    } as unknown as jest.Mocked<CustomerService>;
    controller = new CustomerController(service);
  });

  it("delegates customer endpoints to the service", async () => {
    const createDto = createCustomerDto();
    const updateDto = updateCustomerDto();

    await controller.create(createDto);
    await controller.findAll({ page: 1, limit: 10 });
    await controller.findByDocument("52998224725");
    await controller.findStatusByDocument("52998224725");
    await controller.findById("customer-1");
    await controller.update("customer-1", updateDto);
    await controller.delete("customer-1");

    expect(service.create).toHaveBeenCalledWith(createDto);
    expect(service.findAll).toHaveBeenCalledWith({ page: 1, limit: 10 });
    expect(service.findByDocument).toHaveBeenCalledWith("52998224725");
    expect(service.findStatusByDocument).toHaveBeenCalledWith("52998224725");
    expect(service.findById).toHaveBeenCalledWith("customer-1");
    expect(service.update).toHaveBeenCalledWith("customer-1", updateDto);
    expect(service.delete).toHaveBeenCalledWith("customer-1");
  });

  it("keeps customer signup public", () => {
    expect(Reflect.getMetadata(IS_PUBLIC_KEY, controller.create)).toBe(true);
  });
});
