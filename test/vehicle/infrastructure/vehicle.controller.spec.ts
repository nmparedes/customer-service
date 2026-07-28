import { VehicleService } from "../../../src/vehicle/application/services/vehicle.service";
import { VehicleController } from "../../../src/vehicle/infrastructure/controllers/vehicle.controller";
import { createVehicleDto, updateVehicleDto } from "../vehicle.factory";

describe("VehicleController", () => {
  let service: jest.Mocked<VehicleService>;
  let controller: VehicleController;

  beforeEach(() => {
    const response = {
      id: "vehicle-1",
      licensePlate: "ABC1234",
      formattedLicensePlate: "ABC-1234",
      licensePlateType: "LEGACY" as const,
      make: "Toyota",
      model: "Corolla",
      year: 2023,
      color: "White",
      customerId: "customer-1",
      active: true,
      createdAt: new Date("2024-01-01T00:00:00.000Z"),
      updatedAt: new Date("2024-01-02T00:00:00.000Z"),
    };

    service = {
      create: jest.fn().mockResolvedValue(response),
      findAll: jest.fn().mockResolvedValue({ data: [response], meta: {} }),
      findByLicensePlate: jest.fn().mockResolvedValue(response),
      findByCustomerId: jest.fn().mockResolvedValue([response]),
      findById: jest.fn().mockResolvedValue(response),
      update: jest.fn().mockResolvedValue(response),
      delete: jest.fn().mockResolvedValue(undefined),
    } as unknown as jest.Mocked<VehicleService>;
    controller = new VehicleController(service);
  });

  it("delegates vehicle endpoints to the service", async () => {
    const createDto = createVehicleDto();
    const updateDto = updateVehicleDto();

    await controller.create(createDto);
    await controller.findAll({ page: 1, limit: 10 });
    await controller.findByLicensePlate("ABC1234");
    await controller.findByCustomerId("customer-1");
    await controller.findById("vehicle-1");
    await controller.update("vehicle-1", updateDto);
    await controller.delete("vehicle-1");

    expect(service.create).toHaveBeenCalledWith(createDto);
    expect(service.findAll).toHaveBeenCalledWith({ page: 1, limit: 10 });
    expect(service.findByLicensePlate).toHaveBeenCalledWith("ABC1234");
    expect(service.findByCustomerId).toHaveBeenCalledWith("customer-1");
    expect(service.findById).toHaveBeenCalledWith("vehicle-1");
    expect(service.update).toHaveBeenCalledWith("vehicle-1", updateDto);
    expect(service.delete).toHaveBeenCalledWith("vehicle-1");
  });
});
