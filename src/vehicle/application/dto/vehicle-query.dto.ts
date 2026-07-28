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

export class VehicleQueryDto {
  @ApiPropertyOptional({ description: "Filter by license plate." })
  @IsOptional()
  @IsString()
  licensePlate?: string;

  @ApiPropertyOptional({ description: "Filter by make." })
  @IsOptional()
  @IsString()
  make?: string;

  @ApiPropertyOptional({ description: "Filter by model." })
  @IsOptional()
  @IsString()
  model?: string;

  @ApiPropertyOptional({ description: "Filter by exact year." })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  year?: number;

  @ApiPropertyOptional({ description: "Filter by minimum year." })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  minimumYear?: number;

  @ApiPropertyOptional({ description: "Filter by maximum year." })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  maximumYear?: number;

  @ApiPropertyOptional({ description: "Filter by owner customer ID." })
  @IsOptional()
  @IsString()
  customerId?: string;

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
    enum: ["licensePlate", "make", "year", "createdAt"],
    default: "createdAt",
  })
  @IsOptional()
  @IsIn(["licensePlate", "make", "year", "createdAt"])
  orderBy?: "licensePlate" | "make" | "year" | "createdAt";

  @ApiPropertyOptional({
    description: "Sort direction.",
    enum: ["ASC", "DESC"],
    default: "DESC",
  })
  @IsOptional()
  @IsIn(["ASC", "DESC"])
  order?: "ASC" | "DESC";
}
