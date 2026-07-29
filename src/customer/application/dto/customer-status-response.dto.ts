import { ApiProperty } from "@nestjs/swagger";

export class CustomerStatusResponseDto {
  @ApiProperty({ example: "550e8400-e29b-41d4-a716-446655440000" })
  id: string;

  @ApiProperty({ example: "52998224725" })
  cpf: string;

  @ApiProperty({ example: true })
  active: boolean;

  @ApiProperty({ example: "ACTIVE" })
  status: string;
}
