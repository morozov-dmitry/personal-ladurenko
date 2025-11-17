import { Injectable } from '@nestjs/common';
import { OrderRepository } from '../../orders/repositories/order.repository';
import { SubmitFormDto } from '../dto/form.dto';

/**
 * Form Service
 *
 * Handles business logic for form submissions.
 * Processes form data and creates orders.
 *
 * @class FormService
 * @author Lostal Development Team
 * @version 1.0.0
 */
@Injectable()
export class FormService {
  constructor(private readonly orderRepository: OrderRepository) {}

  /**
   * Submit a contact form
   *
   * Processes form submission and creates an order with status 1 (New).
   *
   * @param {SubmitFormDto} submitFormDto - Form submission data
   * @returns {Promise<{ orderId: string }>} Created order ID
   */
  async submitForm(submitFormDto: SubmitFormDto): Promise<{ orderId: string }> {
    const order = await this.orderRepository.create({
      name: submitFormDto.name,
      phone: submitFormDto.phone,
      message: submitFormDto.message,
      status: 1,
    });

    return {
      orderId: order.id as string,
    };
  }
}

