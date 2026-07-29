import { Controller, Get, Param } from "@nestjs/common";
import { ApiExcludeController } from "@nestjs/swagger";
import { Public } from "../../../auth/decorators/public.decorator";
import { VehicleService } from "../../application/services/vehicle.service";

type InternalVehicleResponse = {
  id: string;
  customerId: string;
  plate: string;
  brand: string;
  model: string;
  year: number;
};

@Public()
@ApiExcludeController()
@Controller("internal/vehicles")
export class InternalVehicleController {
  constructor(private readonly vehicleService: VehicleService) {}

  @Get(":id")
  async findById(@Param("id") id: string): Promise<InternalVehicleResponse> {
    const vehicle = await this.vehicleService.findById(id);

    return {
      id: vehicle.id,
      customerId: vehicle.customerId,
      plate: vehicle.licensePlate,
      brand: vehicle.make,
      model: vehicle.model,
      year: vehicle.year,
    };
  }
}
