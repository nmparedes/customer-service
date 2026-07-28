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
import { CreateCustomerDto } from "../../application/dto/create-customer.dto";
import { CustomerListResponseDto } from "../../application/dto/customer-list-response.dto";
import { CustomerQueryDto } from "../../application/dto/customer-query.dto";
import { CustomerResponseDto } from "../../application/dto/customer-response.dto";
import { UpdateCustomerDto } from "../../application/dto/update-customer.dto";
import { CustomerService } from "../../application/services/customer.service";

@ApiTags("customers")
@ApiBearerAuth()
@Controller("customers")
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post()
  @ApiOperation({ summary: "Create a customer." })
  @ApiCreatedResponse({ type: CustomerResponseDto })
  create(@Body() dto: CreateCustomerDto): Promise<CustomerResponseDto> {
    return this.customerService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: "List customers with filters and pagination." })
  @ApiOkResponse({ type: CustomerListResponseDto })
  findAll(
    @Query() query: CustomerQueryDto,
  ): Promise<PaginatedResponse<CustomerResponseDto>> {
    return this.customerService.findAll(query);
  }

  @Get("document/:document")
  @ApiOperation({ summary: "Find a customer by CPF or CNPJ." })
  @ApiParam({ name: "document", description: "Customer CPF or CNPJ." })
  @ApiOkResponse({ type: CustomerResponseDto })
  findByDocument(
    @Param("document") document: string,
  ): Promise<CustomerResponseDto> {
    return this.customerService.findByDocument(document);
  }

  @Get(":id")
  @ApiOperation({ summary: "Find a customer by ID." })
  @ApiParam({ name: "id", description: "Customer ID." })
  @ApiOkResponse({ type: CustomerResponseDto })
  findById(@Param("id") id: string): Promise<CustomerResponseDto> {
    return this.customerService.findById(id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update a customer." })
  @ApiParam({ name: "id", description: "Customer ID." })
  @ApiOkResponse({ type: CustomerResponseDto })
  update(
    @Param("id") id: string,
    @Body() dto: UpdateCustomerDto,
  ): Promise<CustomerResponseDto> {
    return this.customerService.update(id, dto);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Deactivate a customer." })
  @ApiParam({ name: "id", description: "Customer ID." })
  @ApiNoContentResponse({ description: "Customer deactivated." })
  delete(@Param("id") id: string): Promise<void> {
    return this.customerService.delete(id);
  }
}
