import { ApiProperty } from "@nestjs/swagger";
import { VehicleResponseDto } from "./vehicle-response.dto";

export class VehicleListMetaDto {
  @ApiProperty({ example: 42 })
  total: number;

  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 10 })
  limit: number;

  @ApiProperty({ example: 5 })
  totalPages: number;
}

export class VehicleListResponseDto {
  @ApiProperty({ type: [VehicleResponseDto] })
  data: VehicleResponseDto[];

  @ApiProperty({ type: VehicleListMetaDto })
  meta: VehicleListMetaDto;
}
