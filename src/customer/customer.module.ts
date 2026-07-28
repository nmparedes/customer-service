import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CustomerService } from "./application/services/customer.service";
import { CUSTOMER_REPOSITORY } from "./customer.tokens";
import { CustomerController } from "./infrastructure/controllers/customer.controller";
import { TypeOrmCustomerRepository } from "./infrastructure/repositories/typeorm-customer.repository";
import { CustomerOrmEntity } from "./infrastructure/typeorm/customer.orm-entity";

@Module({
  imports: [TypeOrmModule.forFeature([CustomerOrmEntity])],
  controllers: [CustomerController],
  providers: [
    CustomerService,
    {
      provide: CUSTOMER_REPOSITORY,
      useClass: TypeOrmCustomerRepository,
    },
  ],
  exports: [CustomerService, CUSTOMER_REPOSITORY],
})
export class CustomerModule {}
