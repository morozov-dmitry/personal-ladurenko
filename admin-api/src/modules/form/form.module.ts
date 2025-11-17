import { Module } from '@nestjs/common';
import { OrdersModule } from '../orders/orders.module';
import { FormController } from './controllers/form.controller';
import { FormService } from './services/form.service';

/**
 * Form Module
 *
 * Handles public form submissions and creates orders.
 * This module provides a public-facing endpoint for contact form submissions.
 *
 * @class FormModule
 * @author Lostal Development Team
 * @version 1.0.0
 */
@Module({
  imports: [OrdersModule],
  controllers: [FormController],
  providers: [FormService],
})
export class FormModule {}
