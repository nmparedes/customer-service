import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CustomerModule } from "../customer/customer.module";
import { VehicleService } from "./application/services/vehicle.service";
import { VEHICLE_REPOSITORY } from "./vehicle.tokens";
import { InternalVehicleController } from "./infrastructure/controllers/internal-vehicle.controller";
import { TypeOrmVehicleRepository } from "./infrastructure/repositories/typeorm-vehicle.repository";
import { VehicleOrmEntity } from "./infrastructure/typeorm/vehicle.orm-entity";
import { VehicleController } from "./infrastructure/controllers/vehicle.controller";

@Module({
  imports: [TypeOrmModule.forFeature([VehicleOrmEntity]), CustomerModule],
  controllers: [VehicleController, InternalVehicleController],
  providers: [
    VehicleService,
    {
      provide: VEHICLE_REPOSITORY,
      useClass: TypeOrmVehicleRepository,
    },
  ],
  exports: [VehicleService, VEHICLE_REPOSITORY],
})
export class VehicleModule {}
