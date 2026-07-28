import { ApiPropertyOptional } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import {
  IsBoolean,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from "class-validator";

export class CustomerQueryDto {
  @ApiPropertyOptional({ description: "Filter by customer name." })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: "Filter by CPF or CNPJ." })
  @IsOptional()
  @IsString()
  document?: string;

  @ApiPropertyOptional({ description: "Filter by active flag." })
  @IsOptional()
  @Transform(({ value }) => value === "true" || value === true)
  @IsBoolean()
  active?: boolean;

  @ApiPropertyOptional({ description: "Page number.", default: 1, minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({ description: "Page size.", default: 10, minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number;

  @ApiPropertyOptional({
    description: "Sort field.",
    enum: ["name", "createdAt"],
    default: "createdAt",
  })
  @IsOptional()
  @IsIn(["name", "createdAt"])
  orderBy?: "name" | "createdAt";

  @ApiPropertyOptional({
    description: "Sort direction.",
    enum: ["ASC", "DESC"],
    default: "DESC",
  })
  @IsOptional()
  @IsIn(["ASC", "DESC"])
  order?: "ASC" | "DESC";
}
