import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "./auth/auth.module";
import { validateEnvironment } from "./common/config/environment.validation";
import { CustomerModule } from "./customer/customer.module";
import { DatabaseModule } from "./database/database.module";
import { HealthModule } from "./health/health.module";
import { MessagingModule } from "./messaging/rabbitmq-broker";
import { VehicleModule } from "./vehicle/vehicle.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnvironment,
    }),
    DatabaseModule,
    AuthModule,
    CustomerModule,
    VehicleModule,
    HealthModule,
    MessagingModule,
  ],
})
export class AppModule {}
