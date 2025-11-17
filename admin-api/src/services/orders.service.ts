import { Injectable } from '@nestjs/common';
import { DynamoDBService } from './dynamodb.service';
import { OrderRepository } from '../modules/orders/repositories/order.repository';

@Injectable()
export class OrdersService {
  constructor(
    private readonly dynamoDBService: DynamoDBService,
    private readonly orderRepository: OrderRepository,
  ) {}

  async createOrder(orderData: any) {
    // Check if DynamoDB is connected
    if (!this.dynamoDBService.getConnectionStatus()) {
      throw new Error('DynamoDB service is not connected');
    }

    return await this.orderRepository.create(orderData);
  }

  async getAllOrders() {
    return await this.orderRepository.findAll();
  }

  async getOrderById(id: string) {
    return await this.orderRepository.findById(id);
  }

  async getOrdersByStatus(status: number) {
    // Use the new paginated method with status filter
    const filters = [`status:${status}`];
    const result = await this.orderRepository.findAllPaginated(1, 1000, '', filters);
    return result.data;
  }

  async updateOrder(id: string, data: any) {
    return await this.orderRepository.update(id, data);
  }

  async deleteOrder(id: string) {
    return await this.orderRepository.delete(id);
  }

  async getOrdersCount() {
    // Use the new paginated method to get total count
    const result = await this.orderRepository.findAllPaginated(1, 1, '', []);
    return result.total;
  }

  async getOrdersByDateRange(startDate: Date, endDate: Date) {
    // Use the new paginated method with date range filter
    const startDateStr = startDate.toISOString().split('T')[0];
    const endDateStr = endDate.toISOString().split('T')[0];
    const filters = [`createdAt:${startDateStr},${endDateStr}`];
    const result = await this.orderRepository.findAllPaginated(1, 1000, '', filters);
    return result.data;
  }

  // Get DynamoDB service info
  getServiceInfo() {
    return {
      connected: this.dynamoDBService.getConnectionStatus(),
      region: this.dynamoDBService.getRegion(),
      environment: this.dynamoDBService.getEnvironment(),
      tablePrefix: this.dynamoDBService.getTablePrefix(),
    };
  }
}
