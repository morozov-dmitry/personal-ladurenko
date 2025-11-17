import { Injectable } from '@nestjs/common';
import { InjectModel, Model } from 'nestjs-dynamoose';
import { Order } from '../entities/order.entity';
import { FilterService } from '../../../services/filter.service';

// Export the Order type for use in services
export type OrderDocument = Order;

/**
 * Order Repository
 * 
 * Provides data access methods for Order entities using DynamoDB.
 * Implements the repository pattern to abstract database operations
 * and provide a clean interface for order data management.
 * 
 * @class OrderRepository
 * @author Lostal Development Team
 * @version 1.0.0
 */
@Injectable()
export class OrderRepository {
  /**
   * Creates an instance of OrderRepository.
   * 
   * @param {Model<Order>} orderModel - Injected Order model from nestjs-dynamoose
   * @param {DynamoDBService} dynamoDBService - Service for DynamoDB configuration and health checks
   */
  constructor(
    @InjectModel('Order')
    private readonly orderModel: Model<Order, any>,
    private readonly filterService: FilterService,
  ) {}

  /**
   * Get field types for Order entity from schema
   * Used by FilterService for proper type conversion
   */
  private getFieldTypes(): Record<string, string> {
    // Define field types manually since Dynamoose schema extraction is complex
    return {
      id: 'String',
      name: 'String',
      phone: 'String',
      message: 'String',
      status: 'Number',
      createdAt: 'Date',
      updatedAt: 'Date'
    };
  }

  /**
   * Create a new order
   * 
   * Creates a new order record in the database with the provided data.
   * Automatically generates a UUID for the order ID and sets creation timestamps.
   * 
   * @param {Partial<Order>} data - Order data to create
   * @returns {Promise<any>} Created order document with generated ID and timestamps
   * 
   * @throws {Error} When DynamoDB operation fails
   * 
   * @example
   * const order = await orderRepository.create({
   *   name: 'John Doe',
   *   phone: '+380961234567',
   *   message: 'I need legal consultation',
   *   status: 1
   * });
   */
  async create(data: any): Promise<any> {
    return this.orderModel.create(data);
  }

  /**
   * Find order by ID
   * 
   * Retrieves a single order by its unique identifier.
   * 
   * @param {string} id - Order unique identifier (UUID)
   * @returns {Promise<any>} Order document or null if not found
   * 
   * @throws {Error} When DynamoDB operation fails
   * 
   * @example
   * const order = await orderRepository.findById('123e4567-e89b-12d3-a456-426614174000');
   */
  async findById(id: string): Promise<any> {
    return this.orderModel.get(id);
  }

  /**
   * Find all orders
   * 
   * Retrieves all orders from the database.
   * Note: This performs a scan operation which can be expensive for large datasets.
   * Consider implementing pagination for production use.
   * 
   * @returns {Promise<any[]>} Array of all order documents
   * 
   * @throws {Error} When DynamoDB operation fails
   * 
   * @example
   * const orders = await orderRepository.findAll();
   */
  async findAll(): Promise<any[]> {
    return this.orderModel.scan().exec();
  }

  /**
   * Find orders with pagination
   * 
   * Retrieves orders with pagination support including sorting and filtering.
   * 
   * @param {number} page - Page number (1-based)
   * @param {number} limit - Number of records per page
   * @param {string} sort - Sort field and direction (e.g., 'id,DESC' or 'createdAt,ASC')
   * @param {string[]} filters - Array of filter strings (format: 'field||operator||value')
   * @returns {Promise<{data: any[], count: number, total: number, page: number, pageCount: number}>} Paginated result
   * 
   * @throws {Error} When DynamoDB operation fails
   * 
   * @example
   * const result = await orderRepository.findAllPaginated(1, 10, 'id,DESC', ['status||eq||1']);
   * // Returns: { data: [...], count: 10, total: 25, page: 1, pageCount: 3 }
   */
  async findAllPaginated(
    page: number = 1, 
    limit: number = 10, 
    sort: string = 'id,DESC',
    filters: string[] = []
  ): Promise<{
    data: any[];
    count: number;
    total: number;
    page: number;
    pageCount: number;
  }> {
    // Use FilterService for complete query processing
    return await this.filterService.processQuery(
      this.orderModel,
      filters,
      this.getFieldTypes(),
      sort,
      page,
      limit
    );
  }



  /**
   * Update an existing order
   * 
   * Updates an order with new data. Only provided fields will be updated.
   * 
   * @param {string} id - Order unique identifier (UUID)
   * @param {Partial<Order>} data - Order data to update
   * @returns {Promise<any>} Updated order document
   * 
   * @throws {Error} When DynamoDB operation fails
   * 
   * @example
   * const updatedOrder = await orderRepository.update('123e4567-e89b-12d3-a456-426614174000', {
   *   status: 2,
   *   message: 'Updated message'
   * });
   */
  async update(id: string, data: Partial<Order>): Promise<any> {
    return this.orderModel.update({ id }, data);
  }

  /**
   * Delete an order
   * 
   * Permanently deletes an order from the database.
   * 
   * @param {string} id - Order unique identifier (UUID)
   * @returns {Promise<void>} Resolves when deletion is complete
   * 
   * @throws {Error} When DynamoDB operation fails
   * 
   * @example
   * await orderRepository.delete('123e4567-e89b-12d3-a456-426614174000');
   */
  async delete(id: string): Promise<void> {
    return this.orderModel.delete(id);
  }

}