import { ApiPropertyOptional, OmitType, PartialType } from "@nestjs/swagger";
import { IsOptional, IsString, MinLength } from "class-validator";
import { CreateCustomerDto } from "./create-customer.dto";

export class UpdateCustomerDto extends PartialType(
  OmitType(CreateCustomerDto, ["document"] as const),
) {
  @ApiPropertyOptional({ description: "Customer full name.", minLength: 3 })
  @IsOptional()
  @IsString()
  @MinLength(3)
  name?: string;
}
