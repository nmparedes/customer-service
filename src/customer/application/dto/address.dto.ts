import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString, Length, Matches } from "class-validator";

export class AddressDto {
  @ApiProperty({ description: "Street name.", example: "Rua das Flores" })
  @IsString()
  street: string;

  @ApiProperty({ description: "Street number.", example: "123" })
  @IsString()
  number: string;

  @ApiPropertyOptional({
    description: "Address complement.",
    example: "Apt 45",
  })
  @IsOptional()
  @IsString()
  complement?: string;

  @ApiProperty({ description: "Neighborhood.", example: "Centro" })
  @IsString()
  neighborhood: string;

  @ApiProperty({ description: "City.", example: "Sao Paulo" })
  @IsString()
  city: string;

  @ApiProperty({
    description: "State UF.",
    example: "SP",
    minLength: 2,
    maxLength: 2,
  })
  @IsString()
  @Length(2, 2)
  state: string;

  @ApiProperty({ description: "Brazilian ZIP code.", example: "01234-567" })
  @IsString()
  @Matches(/^\d{5}-?\d{3}$/, { message: "Zip code is invalid." })
  zipCode: string;
}
