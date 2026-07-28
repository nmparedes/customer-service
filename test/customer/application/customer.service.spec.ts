import { CustomerAlreadyExistsException } from "../../../src/customer/domain/exceptions/customer-already-exists.exception";
import { CustomerNotFoundException } from "../../../src/customer/domain/exceptions/customer-not-found.exception";
import { CustomerRepository } from "../../../src/customer/domain/repositories/customer.repository.interface";
import { CustomerService } from "../../../src/customer/application/services/customer.service";
import {
  createCustomer,
  createCustomerDto,
  updateCustomerDto,
} from "../customer.factory";

describe("CustomerService", () => {
  let repository: jest.Mocked<CustomerRepository>;
  let service: CustomerService;

  beforeEach(() => {
    repository = {
      save: jest.fn(),
      findById: jest.fn(),
      findByDocument: jest.fn(),
      findAll: jest.fn(),
      delete: jest.fn(),
    };
    service = new CustomerService(repository);
  });

  it("creates a customer when the document is unique", async () => {
    const dto = createCustomerDto();
    const customer = createCustomer();
    repository.findByDocument.mockResolvedValue(null);
    repository.save.mockResolvedValue(customer);

    const result = await service.create(dto);

    expect(repository.findByDocument).toHaveBeenCalledWith("52998224725");
    expect(repository.save).toHaveBeenCalled();
    expect(result).toMatchObject({
      name: customer.name,
      document: "52998224725",
      formattedDocument: "529.982.247-25",
      documentType: "CPF",
      active: true,
    });
  });

  it("rejects duplicate customer documents", async () => {
    repository.findByDocument.mockResolvedValue(createCustomer());

    await expect(service.create(createCustomerDto())).rejects.toThrow(
      CustomerAlreadyExistsException,
    );
    expect(repository.save).not.toHaveBeenCalled();
  });

  it("finds customers by id and document", async () => {
    const customer = createCustomer();
    repository.findById.mockResolvedValue(customer);
    repository.findByDocument.mockResolvedValue(customer);

    await expect(service.findById(customer.id)).resolves.toHaveProperty(
      "id",
      customer.id,
    );
    await expect(
      service.findByDocument("529.982.247-25"),
    ).resolves.toHaveProperty("document", "52998224725");
    expect(repository.findByDocument).toHaveBeenCalledWith("52998224725");
  });

  it("throws when customer is not found", async () => {
    repository.findById.mockResolvedValue(null);
    repository.findByDocument.mockResolvedValue(null);

    await expect(service.findById("missing")).rejects.toThrow(
      CustomerNotFoundException,
    );
    await expect(service.findByDocument("52998224725")).rejects.toThrow(
      CustomerNotFoundException,
    );
  });

  it("lists customers with filters and pagination", async () => {
    const customers = [createCustomer(), createCustomer({ id: "customer-2" })];
    repository.findAll.mockResolvedValueOnce(customers.slice(0, 1));
    repository.findAll.mockResolvedValueOnce(customers);

    const result = await service.findAll({
      name: "Joao",
      document: "529.982.247-25",
      active: true,
      page: 1,
      limit: 1,
    });

    expect(result.data).toHaveLength(1);
    expect(result.meta).toEqual({
      total: 2,
      page: 1,
      limit: 1,
      totalPages: 2,
    });
    expect(repository.findAll).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        document: "52998224725",
        page: 1,
        limit: 1,
      }),
    );
    expect(repository.findAll).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        document: "52998224725",
        active: true,
      }),
    );
  });

  it("updates and soft deletes customers", async () => {
    const customer = createCustomer();
    repository.findById.mockResolvedValue(customer);
    repository.save.mockImplementation(async (savedCustomer) => savedCustomer);
    repository.delete.mockResolvedValue(undefined);

    const updated = await service.update(customer.id, updateCustomerDto());
    await service.delete(customer.id);

    expect(updated.name).toBe("Maria Silva");
    expect(repository.save).toHaveBeenCalled();
    expect(repository.delete).toHaveBeenCalledWith(customer.id);
  });

  it("throws when updating or deleting a missing customer", async () => {
    repository.findById.mockResolvedValue(null);

    await expect(
      service.update("missing", updateCustomerDto()),
    ).rejects.toThrow(CustomerNotFoundException);
    await expect(service.delete("missing")).rejects.toThrow(
      CustomerNotFoundException,
    );
  });
});
