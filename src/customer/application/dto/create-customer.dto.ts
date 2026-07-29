import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsEmail, IsString, MinLength, ValidateNested } from "class-validator";
import { IsCpfOrCnpj } from "../../../common/validators/cpf-cnpj.validator";
import { AddressDto } from "./address.dto";

export class CreateCustomerDto {
  @ApiProperty({
    description: "Customer full name.",
    example: "Joao da Silva",
    minLength: 3,
  })
  @IsString()
  @MinLength(3)
  name: string;

  @ApiProperty({
    description: "Customer CPF or CNPJ.",
    example: "111.444.777-35",
  })
  @IsCpfOrCnpj()
  document: string;

  @ApiProperty({
    description: "Customer email.",
    example: "joao.silva@example.com",
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: "Customer contact phone.",
    example: "11987654321",
  })
  @IsString()
  phone: string;

  @ApiProperty({ description: "Customer address.", type: AddressDto })
  @ValidateNested()
  @Type(() => AddressDto)
  address: AddressDto;
}
