/**
 * Login Data Transfer Object
 * 
 * DTO for user login requests. Contains validation rules for username and password.
 * Used by the login endpoint to validate incoming authentication data.
 * 
 * @class LoginDto
 * @example
 * ```typescript
 * // Login request body
 * const loginData: LoginDto = {
 *   username: 'john_doe',
 *   password: 'password123'
 * };
 * ```
 */
import { IsString, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  /**
   * Username for authentication
   * 
   * Must be a non-empty string with minimum length of 3 characters.
   * 
   * @type {string}
   * @example 'john_doe'
   */
  @ApiProperty({
    description: 'Username for authentication',
    example: 'john_doe',
    minLength: 3,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  username: string;

  /**
   * User password
   * 
   * Must be a non-empty string with minimum length of 6 characters.
   * 
   * @type {string}
   * @example 'password123'
   */
  @ApiProperty({
    description: 'User password',
    example: 'password123',
    minLength: 6,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
