/**
 * Registration Data Transfer Object
 * 
 * DTO for user registration requests. Contains validation rules for all user fields
 * required for account creation. Used by the registration endpoint to validate
 * incoming user data.
 * 
 * @class RegisterDto
 * @example
 * ```typescript
 * // Registration request body
 * const registerData: RegisterDto = {
 *   username: 'john_doe',
 *   password: 'password123',
 *   name: 'John Doe',
 *   email: 'john@example.com',
 *   town: 'Kyiv',
 *   address: '123 Main Street',
 *   phone: '+380961234567'
 * };
 * ```
 */
import { IsString, IsNotEmpty, MinLength, IsEmail, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  /**
   * Username for the account
   * 
   * Must be a unique, non-empty string with minimum length of 3 characters.
   * 
   * @type {string}
   * @example 'john_doe'
   */
  @ApiProperty({
    description: 'Username for the account',
    example: 'john_doe',
    minLength: 3,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  username: string;

  /**
   * Password for the account
   * 
   * Must be a non-empty string with minimum length of 6 characters.
   * Will be hashed before storage.
   * 
   * @type {string}
   * @example 'password123'
   */
  @ApiProperty({
    description: 'Password for the account',
    example: 'password123',
    minLength: 6,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  /**
   * Full name of the user
   * 
   * Optional field for user's display name.
   * 
   * @type {string}
   * @example 'John Doe'
   * @optional
   */
  @ApiProperty({
    description: 'Full name of the user',
    example: 'John Doe',
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string;

  /**
   * Email address
   * 
   * Optional field for user's email address. Must be valid email format if provided.
   * 
   * @type {string}
   * @example 'john@example.com'
   * @optional
   */
  @ApiProperty({
    description: 'Email address',
    example: 'john@example.com',
    required: false,
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  /**
   * Town or city
   * 
   * Required field for user's location.
   * 
   * @type {string}
   * @example 'Kyiv'
   */
  @ApiProperty({
    description: 'Town or city',
    example: 'Kyiv',
  })
  @IsString()
  @IsNotEmpty()
  town: string;

  /**
   * Physical address
   * 
   * Required field for user's physical address.
   * 
   * @type {string}
   * @example '123 Main Street'
   */
  @ApiProperty({
    description: 'Physical address',
    example: '123 Main Street',
  })
  @IsString()
  @IsNotEmpty()
  address: string;

  /**
   * Phone number
   * 
   * Required field for user's contact phone number.
   * 
   * @type {string}
   * @example '+380961234567'
   */
  @ApiProperty({
    description: 'Phone number',
    example: '+380961234567',
  })
  @IsString()
  @IsNotEmpty()
  phone: string;
}
