import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { LicensePlateType } from "../../domain/enums/license-plate-type.enum";

export class VehicleOwnerResponseDto {
  @ApiProperty({ example: "550e8400-e29b-41d4-a716-446655440000" })
  id: string;

  @ApiProperty({ example: "Joao Silva" })
  name: string;
}

export class VehicleResponseDto {
  @ApiProperty({ example: "550e8400-e29b-41d4-a716-446655440001" })
  id: string;

  @ApiProperty({ example: "ABC1234" })
  licensePlate: string;

  @ApiProperty({ example: "ABC-1234" })
  formattedLicensePlate: string;

  @ApiProperty({ enum: LicensePlateType, example: LicensePlateType.LEGACY })
  licensePlateType: LicensePlateType;

  @ApiProperty({ example: "Toyota" })
  make: string;

  @ApiProperty({ example: "Corolla" })
  model: string;

  @ApiProperty({ example: 2023 })
  year: number;

  @ApiPropertyOptional({ example: "White" })
  color?: string;

  @ApiProperty({ example: "550e8400-e29b-41d4-a716-446655440000" })
  customerId: string;

  @ApiPropertyOptional({ type: VehicleOwnerResponseDto })
  customer?: VehicleOwnerResponseDto;

  @ApiProperty({ example: true })
  active: boolean;

  @ApiProperty({ example: "2024-01-15T10:30:00.000Z", format: "date-time" })
  createdAt: Date;

  @ApiProperty({ example: "2024-01-15T10:30:00.000Z", format: "date-time" })
  updatedAt: Date;
}
