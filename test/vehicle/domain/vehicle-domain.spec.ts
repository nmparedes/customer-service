import { DomainException } from "../../../src/common/exceptions/domain.exception";
import { LicensePlateType } from "../../../src/vehicle/domain/enums/license-plate-type.enum";
import { LicensePlateInvalidException } from "../../../src/vehicle/domain/exceptions/license-plate-invalid.exception";
import { YearInvalidException } from "../../../src/vehicle/domain/exceptions/year-invalid.exception";
import { LicensePlate } from "../../../src/vehicle/domain/value-objects/license-plate.vo";
import { Vehicle } from "../../../src/vehicle/domain/entities/vehicle.entity";
import { createVehicle, ownerCustomerId } from "../vehicle.factory";

describe("LicensePlate", () => {
  it("creates, normalizes, formats and compares legacy and Mercosur plates", () => {
    const legacyPlate = LicensePlate.create("abc-1234");
    const mercosurPlate = LicensePlate.create("ABC1D23");

    expect(legacyPlate.rawValue).toBe("ABC1234");
    expect(legacyPlate.plateType).toBe(LicensePlateType.LEGACY);
    expect(legacyPlate.format()).toBe("ABC-1234");
    expect(mercosurPlate.rawValue).toBe("ABC1D23");
    expect(mercosurPlate.plateType).toBe(LicensePlateType.MERCOSUR);
    expect(mercosurPlate.format()).toBe("ABC1D23");
    expect(legacyPlate.equals(LicensePlate.create("ABC1234"))).toBe(true);
    expect(legacyPlate.equals(mercosurPlate)).toBe(false);
    expect(legacyPlate.equals(undefined)).toBe(false);
  });

  it("rejects invalid plates", () => {
    expect(LicensePlate.isValid("ABC-1234")).toBe(true);
    expect(LicensePlate.isValid("invalid")).toBe(false);
    expect(() => LicensePlate.create("")).toThrow(LicensePlateInvalidException);
    expect(() => LicensePlate.create("invalid")).toThrow(
      LicensePlateInvalidException,
    );
    expect(() => LicensePlate.detectType("invalid")).toThrow(
      LicensePlateInvalidException,
    );
  });
});

describe("Vehicle", () => {
  it("creates, updates, activates and deactivates vehicles", () => {
    const vehicle = createVehicle({ active: false });
    const originalLicensePlate = vehicle.licensePlate;
    const originalCreatedAt = vehicle.createdAt;

    vehicle.activate();
    expect(vehicle.active).toBe(true);

    vehicle.update({
      make: "Honda",
      model: "Civic",
      year: 2024,
      color: "Black",
    });

    expect(vehicle.make).toBe("Honda");
    expect(vehicle.model).toBe("Civic");
    expect(vehicle.year).toBe(2024);
    expect(vehicle.color).toBe("Black");
    expect(vehicle.customerId).toBe(ownerCustomerId);
    expect(vehicle.licensePlate).toBe(originalLicensePlate);
    expect(vehicle.createdAt).toBe(originalCreatedAt);

    vehicle.deactivate();
    expect(vehicle.active).toBe(false);
  });

  it("rejects invalid vehicle data", () => {
    expect(() => createVehicle({ make: "" })).toThrow(DomainException);
    expect(() => createVehicle({ make: "T" })).toThrow(DomainException);
    expect(() => createVehicle({ model: "" })).toThrow(DomainException);
    expect(() => createVehicle({ year: 1899 })).toThrow(YearInvalidException);
    expect(() => createVehicle({ year: new Date().getFullYear() + 2 })).toThrow(
      YearInvalidException,
    );
    expect(() => createVehicle({ year: 2023.5 })).toThrow(DomainException);
    expect(() => createVehicle({ customerId: "" })).toThrow(DomainException);
  });

  it("requires license plate", () => {
    expect(() =>
      Vehicle.create({
        licensePlate: undefined as never,
        make: "Toyota",
        model: "Corolla",
        year: 2023,
        customerId: ownerCustomerId,
      }),
    ).toThrow(DomainException);
  });
});
