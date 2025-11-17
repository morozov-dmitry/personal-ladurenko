import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsNumber, IsPhoneNumber, MaxLength } from 'class-validator';
import { Exclude } from 'class-transformer';

/**
 * Order DTOs (Data Transfer Objects)
 * 
 * Defines the data transfer objects for Order operations including validation,
 * API documentation, and type safety for request/response handling.
 * 
 * @fileoverview Order DTOs for API validation and documentation
 * @author Lostal Development Team
 * @version 1.0.0
 */

/**
 * Data Transfer Object for creating a new order
 * 
 * Defines the structure and validation rules for order creation requests.
 * All fields are validated using class-validator decorators and documented
 * for Swagger API documentation.
 * 
 * @class CreateOrderDto
 * @description Request DTO for creating new orders
 * 
 * @example
 * const createOrderDto: CreateOrderDto = {
 *   name: 'John Doe',
 *   phone: '+380961234567',
 *   message: 'I need legal consultation about contract law',
 *   status: 1
 * };
 */
export class CreateOrderDto {
  /**
   * Customer name
   * @description Full name of the customer placing the order
   * @example 'John Doe'
   * @maxLength 255 characters
   */
  @ApiProperty({
    description: 'Customer name',
    example: 'John Doe',
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  /**
   * Customer phone number
   * @description Contact phone number for the customer
   * @example '+380961234567'
   * @maxLength 255 characters
   */
  @ApiProperty({
    description: 'Customer phone number',
    example: '+380961234567',
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  phone: string;

  /**
   * Order message/description
   * @description Detailed message or description of the legal service requested
   * @example 'I need legal consultation about contract law'
   */
  @ApiProperty({
    description: 'Order message/description',
    example: 'I need legal consultation about contract law',
  })
  @IsString()
  @IsNotEmpty()
  message: string;

  /**
   * Order status
   * @description Current status of the order (1: New, 2: In Progress, 3: Completed, etc.)
   * @example 1
   * @default 1
   * @optional
   */
  @ApiProperty({
    description: 'Order status',
    example: 1,
    default: 1,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  status?: number;
}

/**
 * Data Transfer Object for updating an existing order
 * 
 * Defines the structure and validation rules for order update requests.
 * All fields are optional, allowing partial updates of order information.
 * 
 * @class UpdateOrderDto
 * @description Request DTO for updating existing orders
 * 
 * @example
 * const updateOrderDto: UpdateOrderDto = {
 *   status: 2,
 *   message: 'Updated message'
 * };
 */
export class UpdateOrderDto {
  /**
   * Order unique identifier (excluded from updates)
   * @description Auto-generated UUID for the order - excluded from update operations
   */
  @Exclude()
  id?: string;

  /**
   * Customer name
   * @description Full name of the customer placing the order
   * @example 'John Doe'
   * @maxLength 255 characters
   * @optional
   */
  @ApiProperty({
    description: 'Customer name',
    example: 'John Doe',
    maxLength: 255,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  name?: string;

  /**
   * Customer phone number
   * @description Contact phone number for the customer
   * @example '+380961234567'
   * @maxLength 255 characters
   * @optional
   */
  @ApiProperty({
    description: 'Customer phone number',
    example: '+380961234567',
    maxLength: 255,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  phone?: string;

  /**
   * Order message/description
   * @description Detailed message or description of the legal service requested
   * @example 'I need legal consultation about contract law'
   * @optional
   */
  @ApiProperty({
    description: 'Order message/description',
    example: 'I need legal consultation about contract law',
    required: false,
  })
  @IsOptional()
  @IsString()
  message?: string;

  /**
   * Order status
   * @description Current status of the order (1: New, 2: In Progress, 3: Completed, etc.)
   * @example 2
   * @optional
   */
  @ApiProperty({
    description: 'Order status',
    example: 2,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  status?: number;

  /**
   * Order creation date (excluded from updates)
   * @description When the order was created - excluded from update operations
   */
  @Exclude()
  createdAt?: Date;

  /**
   * Order last update date (excluded from updates)
   * @description When the order was last updated - excluded from update operations
   */
  @Exclude()
  updatedAt?: Date;
}

/**
 * Data Transfer Object for order responses
 * 
 * Defines the structure of order data returned by the API.
 * Includes all order fields with generated timestamps and ID.
 * 
 * @class OrderResponseDto
 * @description Response DTO for order operations
 * 
 * @example
 * const orderResponse: OrderResponseDto = {
 *   id: '123e4567-e89b-12d3-a456-426614174000',
 *   name: 'John Doe',
 *   phone: '+380961234567',
 *   message: 'I need legal consultation about contract law',
 *   status: 1,
 *   createdAt: '2024-01-15T10:30:00.000Z',
 *   updatedAt: '2024-01-15T10:30:00.000Z'
 * };
 */
export class OrderResponseDto {
  /**
   * Order unique identifier
   * @description Auto-generated UUID for the order
   * @example '123e4567-e89b-12d3-a456-426614174000'
   */
  @ApiProperty({
    description: 'Order unique identifier',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  /**
   * Customer name
   * @description Full name of the customer
   * @example 'John Doe'
   */
  @ApiProperty({
    description: 'Customer name',
    example: 'John Doe',
  })
  name: string;

  /**
   * Customer phone number
   * @description Contact phone number for the customer
   * @example '+380961234567'
   */
  @ApiProperty({
    description: 'Customer phone number',
    example: '+380961234567',
  })
  phone: string;

  /**
   * Order message/description
   * @description Detailed message or description of the legal service requested
   * @example 'I need legal consultation about contract law'
   */
  @ApiProperty({
    description: 'Order message/description',
    example: 'I need legal consultation about contract law',
  })
  message: string;

  /**
   * Order status
   * @description Current status of the order
   * @example 1
   */
  @ApiProperty({
    description: 'Order status',
    example: 1,
  })
  status: number;

  /**
   * Order creation date
   * @description When the order was created
   * @example '2024-01-15T10:30:00.000Z'
   */
  @ApiProperty({
    description: 'Order creation date',
    example: '2024-01-15T10:30:00.000Z',
  })
  createdAt: Date;

  /**
   * Order last update date
   * @description When the order was last updated
   * @example '2024-01-15T10:30:00.000Z'
   */
  @ApiProperty({
    description: 'Order last update date',
    example: '2024-01-15T10:30:00.000Z',
  })
  updatedAt: Date;
}
