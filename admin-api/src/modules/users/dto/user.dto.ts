import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsNumber, IsEmail, MaxLength, MinLength } from 'class-validator';
import { Exclude } from 'class-transformer';

/**
 * Data Transfer Object for creating a new user
 * 
 * Contains all required and optional fields for user account creation.
 * Includes validation rules and API documentation for each property.
 * 
 * @class CreateUserDto
 * @example
 * ```typescript
 * const createUserDto: CreateUserDto = {
 *   username: "john_doe",
 *   password: "securePassword123",
 *   name: "John Doe",
 *   town: "Kyiv",
 *   address: "123 Main Street, Apt 4B",
 *   email: "john.doe@example.com",
 *   phone: "+380961234567",
 *   status: 1
 * };
 * ```
 */
export class CreateUserDto {
  /**
   * Username for the user account (must be unique)
   * 
   * @type {string}
   * @example "john_doe"
   * @maxLength 128
   */
  @ApiProperty({
    description: 'Username (must be unique)',
    example: 'john_doe',
    maxLength: 128,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(128)
  username: string;

  /**
   * Password for the user account
   * 
   * @type {string}
   * @example "securePassword123"
   * @minLength 6
   */
  @ApiProperty({
    description: 'User password',
    example: 'securePassword123',
    minLength: 6,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  /**
   * Full name of the user (optional)
   * 
   * @type {string}
   * @example "John Doe"
   * @maxLength 255
   * @optional
   */
  @ApiProperty({
    description: 'User full name',
    example: 'John Doe',
    maxLength: 255,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  name?: string;

  /**
   * Town or city where the user is located
   * 
   * @type {string}
   * @example "Kyiv"
   * @maxLength 255
   */
  @ApiProperty({
    description: 'User town/city',
    example: 'Kyiv',
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  town: string;

  /**
   * Physical address of the user
   * 
   * @type {string}
   * @example "123 Main Street, Apt 4B"
   */
  @ApiProperty({
    description: 'User address',
    example: '123 Main Street, Apt 4B',
  })
  @IsString()
  @IsNotEmpty()
  address: string;

  /**
   * Email address of the user (optional)
   * 
   * @type {string}
   * @example "john.doe@example.com"
   * @maxLength 128
   * @optional
   */
  @ApiProperty({
    description: 'User email address',
    example: 'john.doe@example.com',
    maxLength: 128,
    required: false,
  })
  @IsOptional()
  @IsEmail()
  @MaxLength(128)
  email?: string;

  /**
   * Phone number of the user
   * 
   * @type {string}
   * @example "+380961234567"
   * @maxLength 50
   */
  @ApiProperty({
    description: 'User phone number',
    example: '+380961234567',
    maxLength: 50,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  phone: string;

  /**
   * Status of the user account (optional, defaults to 1)
   * 
   * @type {number}
   * @example 1
   * @default 1
   * @optional
   */
  @ApiProperty({
    description: 'User status',
    example: 1,
    default: 1,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  status?: number;
}

/**
 * Data Transfer Object for updating an existing user
 * 
 * Contains optional fields for user account updates. All fields are optional
 * to allow partial updates. Includes validation rules and API documentation.
 * 
 * @class UpdateUserDto
 * @example
 * ```typescript
 * const updateUserDto: UpdateUserDto = {
 *   name: "John Smith",
 *   town: "Lviv",
 *   status: 2
 * };
 * ```
 */
export class UpdateUserDto {
  /**
   * User unique identifier (excluded from updates)
   * @description Auto-generated UUID for the user - excluded from update operations
   */
  @Exclude()
  id?: string;

  /**
   * Username for the user account (optional)
   * 
   * @type {string}
   * @example "john_doe"
   * @maxLength 128
   * @optional
   */
  @ApiProperty({
    description: 'Username (must be unique)',
    example: 'john_doe',
    maxLength: 128,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(128)
  username?: string;

  /**
   * Password for the user account (optional)
   * 
   * @type {string}
   * @example "securePassword123"
   * @minLength 6
   * @optional
   */
  @ApiProperty({
    description: 'User password',
    example: 'securePassword123',
    minLength: 6,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;

  /**
   * Full name of the user (optional)
   * 
   * @type {string}
   * @example "John Doe"
   * @maxLength 255
   * @optional
   */
  @ApiProperty({
    description: 'User full name',
    example: 'John Doe',
    maxLength: 255,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  name?: string;

  /**
   * Town or city where the user is located (optional)
   * 
   * @type {string}
   * @example "Kyiv"
   * @maxLength 255
   * @optional
   */
  @ApiProperty({
    description: 'User town/city',
    example: 'Kyiv',
    maxLength: 255,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  town?: string;

  /**
   * Physical address of the user (optional)
   * 
   * @type {string}
   * @example "123 Main Street, Apt 4B"
   * @optional
   */
  @ApiProperty({
    description: 'User address',
    example: '123 Main Street, Apt 4B',
    required: false,
  })
  @IsOptional()
  @IsString()
  address?: string;

  /**
   * Email address of the user (optional)
   * 
   * @type {string}
   * @example "john.doe@example.com"
   * @maxLength 128
   * @optional
   */
  @ApiProperty({
    description: 'User email address',
    example: 'john.doe@example.com',
    maxLength: 128,
    required: false,
  })
  @IsOptional()
  @IsEmail()
  @MaxLength(128)
  email?: string;

  /**
   * Phone number of the user (optional)
   * 
   * @type {string}
   * @example "+380961234567"
   * @maxLength 50
   * @optional
   */
  @ApiProperty({
    description: 'User phone number',
    example: '+380961234567',
    maxLength: 50,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  phone?: string;

  /**
   * Status of the user account (optional)
   * 
   * @type {number}
   * @example 1
   * @optional
   */
  @ApiProperty({
    description: 'User status',
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  status?: number;

  /**
   * User creation date (excluded from updates)
   * @description When the user was created - excluded from update operations
   */
  @Exclude()
  createdAt?: Date;

  /**
   * User last update date (excluded from updates)
   * @description When the user was last updated - excluded from update operations
   */
  @Exclude()
  updatedAt?: Date;
}

/**
 * Data Transfer Object for user response data
 * 
 * Contains all user information returned by the API, including system-generated
 * fields like ID, timestamps, and computed properties.
 * 
 * @class UserResponseDto
 * @example
 * ```typescript
 * const userResponse: UserResponseDto = {
 *   id: "123e4567-e89b-12d3-a456-426614174000",
 *   username: "john_doe",
 *   name: "John Doe",
 *   town: "Kyiv",
 *   address: "123 Main Street, Apt 4B",
 *   email: "john.doe@example.com",
 *   phone: "+380961234567",
 *   status: 1,
 *   createdAt: new Date("2024-01-15T10:30:00.000Z"),
 *   updatedAt: new Date("2024-01-15T10:30:00.000Z")
 * };
 * ```
 */
export class UserResponseDto {
  /**
   * Unique identifier of the user
   * 
   * @type {string}
   * @example "123e4567-e89b-12d3-a456-426614174000"
   */
  @ApiProperty({
    description: 'User unique identifier',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  /**
   * Username of the user
   * 
   * @type {string}
   * @example "john_doe"
   */
  @ApiProperty({
    description: 'Username',
    example: 'john_doe',
  })
  username: string;

  /**
   * Full name of the user
   * 
   * @type {string}
   * @example "John Doe"
   * @optional
   */
  @ApiProperty({
    description: 'User full name',
    example: 'John Doe',
  })
  name?: string;

  /**
   * Town or city where the user is located
   * 
   * @type {string}
   * @example "Kyiv"
   */
  @ApiProperty({
    description: 'User town/city',
    example: 'Kyiv',
  })
  town: string;

  /**
   * Physical address of the user
   * 
   * @type {string}
   * @example "123 Main Street, Apt 4B"
   */
  @ApiProperty({
    description: 'User address',
    example: '123 Main Street, Apt 4B',
  })
  address: string;

  /**
   * Email address of the user
   * 
   * @type {string}
   * @example "john.doe@example.com"
   * @optional
   */
  @ApiProperty({
    description: 'User email address',
    example: 'john.doe@example.com',
  })
  email?: string;

  /**
   * Phone number of the user
   * 
   * @type {string}
   * @example "+380961234567"
   */
  @ApiProperty({
    description: 'User phone number',
    example: '+380961234567',
  })
  phone: string;

  /**
   * Status of the user account
   * 
   * @type {number}
   * @example 1
   */
  @ApiProperty({
    description: 'User status',
    example: 1,
  })
  status: number;

  /**
   * Date and time when the user was created
   * 
   * @type {Date}
   * @example "2024-01-15T10:30:00.000Z"
   */
  @ApiProperty({
    description: 'User creation date',
    example: '2024-01-15T10:30:00.000Z',
  })
  createdAt: Date;

  /**
   * Date and time when the user was last updated
   * 
   * @type {Date}
   * @example "2024-01-15T10:30:00.000Z"
   */
  @ApiProperty({
    description: 'User last update date',
    example: '2024-01-15T10:30:00.000Z',
  })
  updatedAt: Date;
}