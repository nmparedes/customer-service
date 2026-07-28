import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from "@nestjs/swagger";
import { PaginatedResponse } from "../../../common/interfaces/paginated-response.interface";
import { CreateVehicleDto } from "../../application/dto/create-vehicle.dto";
import { UpdateVehicleDto } from "../../application/dto/update-vehicle.dto";
import { VehicleListResponseDto } from "../../application/dto/vehicle-list-response.dto";
import { VehicleQueryDto } from "../../application/dto/vehicle-query.dto";
import { VehicleResponseDto } from "../../application/dto/vehicle-response.dto";
import { VehicleService } from "../../application/services/vehicle.service";

@ApiTags("vehicles")
@ApiBearerAuth()
@Controller("vehicles")
export class VehicleController {
  constructor(private readonly vehicleService: VehicleService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Create a vehicle." })
  @ApiCreatedResponse({ type: VehicleResponseDto })
  create(@Body() dto: CreateVehicleDto): Promise<VehicleResponseDto> {
    return this.vehicleService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: "List vehicles with filters and pagination." })
  @ApiOkResponse({ type: VehicleListResponseDto })
  findAll(
    @Query() query: VehicleQueryDto,
  ): Promise<PaginatedResponse<VehicleResponseDto>> {
    return this.vehicleService.findAll(query);
  }

  @Get("license-plate/:licensePlate")
  @ApiOperation({ summary: "Find a vehicle by license plate." })
  @ApiParam({ name: "licensePlate", description: "Vehicle license plate." })
  @ApiOkResponse({ type: VehicleResponseDto })
  findByLicensePlate(
    @Param("licensePlate") licensePlate: string,
  ): Promise<VehicleResponseDto> {
    return this.vehicleService.findByLicensePlate(licensePlate);
  }

  @Get("customer/:customerId")
  @ApiOperation({ summary: "List vehicles owned by a customer." })
  @ApiParam({ name: "customerId", description: "Owner customer ID." })
  @ApiOkResponse({ type: [VehicleResponseDto] })
  findByCustomerId(
    @Param("customerId") customerId: string,
  ): Promise<VehicleResponseDto[]> {
    return this.vehicleService.findByCustomerId(customerId);
  }

  @Get(":id")
  @ApiOperation({ summary: "Find a vehicle by ID." })
  @ApiParam({ name: "id", description: "Vehicle ID." })
  @ApiOkResponse({ type: VehicleResponseDto })
  findById(@Param("id") id: string): Promise<VehicleResponseDto> {
    return this.vehicleService.findById(id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update a vehicle." })
  @ApiParam({ name: "id", description: "Vehicle ID." })
  @ApiOkResponse({ type: VehicleResponseDto })
  update(
    @Param("id") id: string,
    @Body() dto: UpdateVehicleDto,
  ): Promise<VehicleResponseDto> {
    return this.vehicleService.update(id, dto);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Deactivate a vehicle." })
  @ApiParam({ name: "id", description: "Vehicle ID." })
  @ApiNoContentResponse({ description: "Vehicle deactivated." })
  delete(@Param("id") id: string): Promise<void> {
    return this.vehicleService.delete(id);
  }
}
