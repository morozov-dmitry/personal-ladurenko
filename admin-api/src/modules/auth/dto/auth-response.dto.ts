/**
 * Authentication Response Data Transfer Object
 * 
 * DTO for authentication responses. Contains JWT token and user information
 * returned after successful login or registration.
 * 
 * @class AuthResponseDto
 * @example
 * ```typescript
 * // Response from login/register endpoints
 * const authResponse: AuthResponseDto = {
 *   access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
 *   user: {
 *     id: '123e4567-e89b-12d3-a456-426614174000',
 *     username: 'john_doe',
 *     name: 'John Doe',
 *     email: 'john@example.com',
 *     status: 1
 *   }
 * };
 * ```
 */
import { ApiProperty } from '@nestjs/swagger';

export class AuthResponseDto {
  /**
   * JWT access token
   * 
   * Bearer token for authenticating subsequent requests.
   * Include in Authorization header: "Bearer {access_token}"
   * 
   * @type {string}
   * @example 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
   */
  @ApiProperty({
    description: 'JWT access token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  access_token: string;

  /**
   * User information
   * 
   * Basic user data returned after authentication.
   * Password is excluded for security.
   * 
   * @type {object}
   * @example {
   *   id: '123e4567-e89b-12d3-a456-426614174000',
   *   username: 'john_doe',
   *   name: 'John Doe',
   *   email: 'john@example.com',
   *   status: 1
   * }
   */
  @ApiProperty({
    description: 'User information',
    example: {
      id: '123e4567-e89b-12d3-a456-426614174000',
      username: 'john_doe',
      name: 'John Doe',
      email: 'john@example.com',
      status: 1,
    },
  })
  user: {
    /** User's unique identifier */
    id: string;
    /** User's username */
    username: string;
    /** User's full name (optional) */
    name?: string;
    /** User's email address (optional) */
    email?: string;
    /** User's account status */
    status: number;
  };
}
