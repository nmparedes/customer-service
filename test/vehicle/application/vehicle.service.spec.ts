import { CustomerRepository } from "../../../src/customer/domain/repositories/customer.repository.interface";
import { CustomerNotFoundException } from "../../../src/customer/domain/exceptions/customer-not-found.exception";
import { VehicleAlreadyExistsException } from "../../../src/vehicle/domain/exceptions/vehicle-already-exists.exception";
import { VehicleNotFoundException } from "../../../src/vehicle/domain/exceptions/vehicle-not-found.exception";
import { VehicleRepository } from "../../../src/vehicle/domain/repositories/vehicle.repository.interface";
import { VehicleService } from "../../../src/vehicle/application/services/vehicle.service";
import { createCustomer } from "../../customer/customer.factory";
import {
  createVehicle,
  createVehicleDto,
  ownerCustomerId,
  updateVehicleDto,
} from "../vehicle.factory";

describe("VehicleService", () => {
  let vehicleRepository: jest.Mocked<VehicleRepository>;
  let customerRepository: jest.Mocked<CustomerRepository>;
  let service: VehicleService;

  beforeEach(() => {
    vehicleRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      findByLicensePlate: jest.fn(),
      findByCustomerId: jest.fn(),
      findAll: jest.fn(),
      delete: jest.fn(),
    };
    customerRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      findByDocument: jest.fn(),
      findAll: jest.fn(),
      delete: jest.fn(),
    };
    service = new VehicleService(vehicleRepository, customerRepository);
  });

  it("creates a vehicle when customer exists and plate is unique", async () => {
    const customer = createCustomer({ id: ownerCustomerId });
    const vehicle = createVehicle();
    customerRepository.findById.mockResolvedValue(customer);
    vehicleRepository.findByLicensePlate.mockResolvedValue(null);
    vehicleRepository.save.mockResolvedValue(vehicle);

    const result = await service.create(createVehicleDto());

    expect(customerRepository.findById).toHaveBeenCalledWith(ownerCustomerId);
    expect(vehicleRepository.findByLicensePlate).toHaveBeenCalledWith(
      "ABC1234",
    );
    expect(vehicleRepository.save).toHaveBeenCalled();
    expect(result).toMatchObject({
      licensePlate: "ABC1234",
      formattedLicensePlate: "ABC-1234",
      licensePlateType: "LEGACY",
      customerId: ownerCustomerId,
      customer: {
        id: ownerCustomerId,
        name: customer.name,
      },
    });
  });

  it("rejects missing owner customer and duplicate license plates", async () => {
    customerRepository.findById.mockResolvedValueOnce(null);
    await expect(service.create(createVehicleDto())).rejects.toThrow(
      CustomerNotFoundException,
    );

    customerRepository.findById.mockResolvedValue(createCustomer());
    vehicleRepository.findByLicensePlate.mockResolvedValue(createVehicle());
    await expect(service.create(createVehicleDto())).rejects.toThrow(
      VehicleAlreadyExistsException,
    );
    expect(vehicleRepository.save).not.toHaveBeenCalled();
  });

  it("finds vehicles by id, license plate and customer id", async () => {
    const customer = createCustomer({ id: ownerCustomerId });
    const vehicle = createVehicle();
    customerRepository.findById.mockResolvedValue(customer);
    vehicleRepository.findById.mockResolvedValue(vehicle);
    vehicleRepository.findByLicensePlate.mockResolvedValue(vehicle);
    vehicleRepository.findByCustomerId.mockResolvedValue([vehicle]);

    await expect(service.findById(vehicle.id)).resolves.toHaveProperty(
      "id",
      vehicle.id,
    );
    await expect(
      service.findByLicensePlate("abc-1234"),
    ).resolves.toHaveProperty("licensePlate", "ABC1234");
    await expect(
      service.findByCustomerId(ownerCustomerId),
    ).resolves.toHaveLength(1);
  });

  it("throws for missing vehicles and missing owner on owner listing", async () => {
    vehicleRepository.findById.mockResolvedValue(null);
    vehicleRepository.findByLicensePlate.mockResolvedValue(null);
    customerRepository.findById.mockResolvedValue(null);

    await expect(service.findById("missing")).rejects.toThrow(
      VehicleNotFoundException,
    );
    await expect(service.findByLicensePlate("ABC1234")).rejects.toThrow(
      VehicleNotFoundException,
    );
    await expect(service.findByCustomerId(ownerCustomerId)).rejects.toThrow(
      CustomerNotFoundException,
    );
  });

  it("lists vehicles with filters, pagination and cached customer lookups", async () => {
    const customer = createCustomer({ id: ownerCustomerId });
    const vehicles = [
      createVehicle(),
      createVehicle({ id: "550e8400-e29b-41d4-a716-446655440002" }),
    ];
    vehicleRepository.findAll.mockResolvedValueOnce(vehicles.slice(0, 1));
    vehicleRepository.findAll.mockResolvedValueOnce(vehicles);
    customerRepository.findById.mockResolvedValue(customer);

    const result = await service.findAll({
      licensePlate: "abc-1234",
      make: "Toyota",
      model: "Corolla",
      year: 2023,
      minimumYear: 2020,
      maximumYear: 2024,
      customerId: ownerCustomerId,
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
    expect(vehicleRepository.findAll).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({ licensePlate: "ABC1234", page: 1, limit: 1 }),
    );
    expect(vehicleRepository.findAll).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({ licensePlate: "ABC1234", active: true }),
    );
  });

  it("updates and soft deletes vehicles", async () => {
    const vehicle = createVehicle();
    customerRepository.findById.mockResolvedValue(createCustomer());
    vehicleRepository.findById.mockResolvedValue(vehicle);
    vehicleRepository.save.mockImplementation(
      async (savedVehicle) => savedVehicle,
    );

    const updated = await service.update(vehicle.id, updateVehicleDto());
    await service.delete(vehicle.id);

    expect(updated.make).toBe("Honda");
    expect(vehicle.active).toBe(false);
    expect(vehicleRepository.save).toHaveBeenCalledTimes(2);
  });

  it("throws when updating or deleting missing vehicles", async () => {
    vehicleRepository.findById.mockResolvedValue(null);

    await expect(service.update("missing", updateVehicleDto())).rejects.toThrow(
      VehicleNotFoundException,
    );
    await expect(service.delete("missing")).rejects.toThrow(
      VehicleNotFoundException,
    );
  });
});
