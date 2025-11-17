import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { FormService } from '../services/form.service';
import { SubmitFormDto } from '../dto/form.dto';

/**
 * Form Controller
 *
 * Handles HTTP requests for public form submissions.
 * Accepts contact form data and creates orders from submissions.
 *
 * @class FormController
 * @author Lostal Development Team
 * @version 1.0.0
 */
@ApiTags('form')
@Controller('form')
export class FormController {
  /**
   * Creates an instance of FormController.
   *
   * @param {FormService} formService - Service for form submission operations
   */
  constructor(private readonly formService: FormService) {}

  /**
   * Submit a contact form
   *
   * Accepts form submissions from the public website and creates an order
   * with default status of 1 (New). This endpoint is intended for public use.
   *
   * @param {SubmitFormDto} submitFormDto - Form submission data
   * @returns {Promise<void>} No content on success
   *
   * @throws {BadRequestException} When validation fails
   *
   * @example
   * POST /api/form
   * Body: {
   *   "name": "John Doe",
   *   "phone": "+380961234567",
   *   "message": "I need legal consultation about contract law"
   * }
   * Response: 200 OK
   */
  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Submit contact form',
    description:
      'Accepts form submissions and creates an order with status 1 (New)',
  })
  @ApiBody({ type: SubmitFormDto })
  @ApiResponse({
    status: 200,
    description: 'Form submitted successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - validation failed',
  })
  async submit(@Body() submitFormDto: SubmitFormDto): Promise<void> {
    await this.formService.submitForm(submitFormDto);
  }
}
