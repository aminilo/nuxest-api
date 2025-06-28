import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsOptional,
  IsNotEmpty,
  IsUUID,
  IsInt,
  IsPositive,
  IsLatitude,
  IsLongitude
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreatePropertyDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty()
  @IsString()
  address: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty()
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @IsPositive()
  price: number;

  @ApiPropertyOptional()
  @Transform(({ value }) => parseFloat(value))
  @IsLatitude()
  @IsOptional()
  lat?: number;

  @ApiPropertyOptional()
  @Transform(({ value }) => parseFloat(value))
  @IsLongitude()
  @IsOptional()
  lng?: number;

  @ApiProperty()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @IsPositive()
  beds: number;

  @ApiProperty()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @IsPositive()
  baths: number;

  @ApiProperty()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @IsPositive()
  sqft: number;

  @ApiPropertyOptional({ type: 'string', format: 'binary' })
  @IsOptional()
  @IsString()
  image?: string;
}

export class UpdatePropertyDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional()
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @IsPositive()
  @IsOptional()
  price?: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  address?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  image?: string;

  @ApiPropertyOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @IsPositive()
  @IsOptional()
  beds?: number;

  @ApiPropertyOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @IsPositive()
  @IsOptional()
  baths?: number;

  @ApiPropertyOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @IsPositive()
  @IsOptional()
  sqft?: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional()
  @Transform(({ value }) => parseFloat(value))
  @IsLatitude()
  @IsOptional()
  lat?: number;

  @ApiPropertyOptional()
  @Transform(({ value }) => parseFloat(value))
  @IsLongitude()
  @IsOptional()
  lng?: number;
}

export class ResponsePropertyDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  slug: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiProperty()
  price: number;

  @ApiProperty()
  address: string;

  @ApiProperty()
  image: string;

  @ApiProperty()
  beds: number;

  @ApiProperty()
  baths: number;

  @ApiProperty()
  sqft: number;

  @ApiProperty()
  phone?: string;

  @ApiProperty()
  lat: number;

  @ApiProperty()
  lng: number;

  @ApiProperty()
  createdAt: Date;
}
