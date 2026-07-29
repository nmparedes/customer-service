import { Controller, Get, Param } from "@nestjs/common";
import { ApiExcludeController } from "@nestjs/swagger";
import { Public } from "../../../auth/decorators/public.decorator";
import { CustomerService } from "../../application/services/customer.service";

type InternalCustomerResponse = {
  id: string;
  document: string;
  name: string;
  status: string;
};

@Public()
@ApiExcludeController()
@Controller("internal/customers")
export class InternalCustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Get("by-document/:document")
  async findByDocument(
    @Param("document") document: string,
  ): Promise<InternalCustomerResponse> {
    const customer = await this.customerService.findByDocument(document);

    return {
      id: customer.id,
      document: customer.document,
      name: customer.name,
      status: customer.active ? "ACTIVE" : "INACTIVE",
    };
  }

  @Get(":id")
  async findById(@Param("id") id: string): Promise<InternalCustomerResponse> {
    const customer = await this.customerService.findById(id);

    return {
      id: customer.id,
      document: customer.document,
      name: customer.name,
      status: customer.active ? "ACTIVE" : "INACTIVE",
    };
  }
}
