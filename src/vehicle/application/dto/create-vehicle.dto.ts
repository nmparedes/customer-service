import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
  MinLength,
} from "class-validator";
import { IsLicensePlate } from "../../../common/validators/license-plate.validator";

export class CreateVehicleDto {
  @ApiProperty({
    description: "Vehicle license plate.",
    examples: {
      legacy: { summary: "Legacy plate", value: "ABC-1234" },
      mercosur: { summary: "Mercosur plate", value: "ABC1D23" },
    },
  })
  @IsLicensePlate()
  licensePlate: string;

  @ApiProperty({
    description: "Vehicle make.",
    example: "Toyota",
    minLength: 2,
  })
  @IsString()
  @MinLength(2)
  make: string;

  @ApiProperty({
    description: "Vehicle model.",
    example: "Corolla",
    minLength: 1,
  })
  @IsString()
  @MinLength(1)
  model: string;

  @ApiProperty({
    description: "Vehicle manufacturing year.",
    example: 2023,
    minimum: 1900,
    maximum: new Date().getFullYear() + 1,
  })
  @IsInt()
  @Min(1900)
  @Max(new Date().getFullYear() + 1)
  year: number;

  @ApiPropertyOptional({ description: "Vehicle color.", example: "White" })
  @IsOptional()
  @IsString()
  color?: string;

  @ApiProperty({
    description: "Owner customer ID.",
    example: "550e8400-e29b-41d4-a716-446655440000",
  })
  @IsUUID()
  customerId: string;
}
