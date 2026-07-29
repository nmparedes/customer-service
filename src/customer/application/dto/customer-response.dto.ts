import { ApiProperty } from "@nestjs/swagger";
import { DocumentType } from "../../domain/enums/document-type.enum";

export class AddressResponseDto {
  @ApiProperty({ example: "Rua das Flores" })
  street: string;

  @ApiProperty({ example: "123" })
  number: string;

  @ApiProperty({ example: "Apt 45", required: false })
  complement?: string;

  @ApiProperty({ example: "Centro" })
  neighborhood: string;

  @ApiProperty({ example: "Sao Paulo" })
  city: string;

  @ApiProperty({ example: "SP" })
  state: string;

  @ApiProperty({ example: "01234-567" })
  zipCode: string;
}

export class CustomerResponseDto {
  @ApiProperty({ example: "550e8400-e29b-41d4-a716-446655440000" })
  id: string;

  @ApiProperty({ example: "Joao da Silva" })
  name: string;

  @ApiProperty({ example: "11144477735" })
  document: string;

  @ApiProperty({ example: "111.444.777-35" })
  formattedDocument: string;

  @ApiProperty({ enum: DocumentType, example: DocumentType.CPF })
  documentType: DocumentType;

  @ApiProperty({ example: "joao.silva@example.com" })
  email: string;

  @ApiProperty({ example: "11987654321" })
  phone: string;

  @ApiProperty({ type: AddressResponseDto })
  address: AddressResponseDto;

  @ApiProperty({ example: true })
  active: boolean;

  @ApiProperty({ example: "2024-01-15T10:30:00.000Z", format: "date-time" })
  createdAt: Date;

  @ApiProperty({ example: "2024-01-15T10:30:00.000Z", format: "date-time" })
  updatedAt: Date;
}
