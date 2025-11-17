import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

/**
 * Form DTOs (Data Transfer Objects)
 *
 * Defines the data transfer objects for Form submission operations.
 * Used for public form submissions that create orders.
 *
 * @fileoverview Form DTOs for API validation and documentation
 * @author Lostal Development Team
 * @version 1.0.0
 */

/**
 * Data Transfer Object for submitting a contact form
 *
 * Defines the structure and validation rules for form submission requests.
 * This DTO accepts basic contact information and creates an order.
 *
 * @class SubmitFormDto
 * @description Request DTO for form submissions
 *
 * @example
 * const formData: SubmitFormDto = {
 *   name: 'John Doe',
 *   phone: '+380961234567',
 *   message: 'I need legal consultation about contract law'
 * };
 */
export class SubmitFormDto {
  /**
   * Customer name
   * @description Full name of the person submitting the form
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
   * @description Contact phone number
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
   * Form message
   * @description Message or inquiry from the customer
   * @example 'I need legal consultation about contract law'
   */
  @ApiProperty({
    description: 'Form message',
    example: 'I need legal consultation about contract law',
  })
  @IsString()
  @IsNotEmpty()
  message: string;
}
