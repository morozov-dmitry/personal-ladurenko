import { 
  Controller, 
  Get, 
  Post, 
  Patch, 
  Delete, 
  Body, 
  Param, 
  Query,
  HttpCode, 
  HttpStatus,
  NotFoundException
} from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiParam, 
  ApiBody,
  ApiQuery
} from '@nestjs/swagger';
import { OrderRepository } from '../repositories/order.repository';
import { OrderDocument } from '../repositories/order.repository';
import { CreateOrderDto, UpdateOrderDto, OrderResponseDto } from '../dto/order.dto';

/**
 * Orders Controller
 * 
 * Handles HTTP requests for order management operations.
 * Provides CRUD operations for customer orders including creation, retrieval,
 * updating, and deletion of order records.
 * 
 * @class OrdersController
 * @author Lostal Development Team
 * @version 1.0.0
 */
@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  /**
   * Creates an instance of OrdersController.
   * 
   * @param {OrderRepository} orderRepository - Repository for order data operations
   */
  constructor(private readonly orderRepository: OrderRepository) {}

  /**
   * Create a new order
   * 
   * Creates a new customer order with the provided information.
   * Validates input data and stores the order in the database.
   * 
   * @param {CreateOrderDto} createOrderDto - Order creation data
   * @returns {Promise<OrderResponseDto>} Created order with generated ID and timestamps
   * 
   * @throws {BadRequestException} When validation fails
   * 
   * @example
   * POST /api/orders
   * Body: {
   *   "name": "John Doe",
   *   "phone": "+380961234567",
   *   "message": "I need legal consultation about contract law",
   *   "status": 1
   * }
   * Response: {
   *   "id": "123e4567-e89b-12d3-a456-426614174000",
   *   "name": "John Doe",
   *   "phone": "+380961234567",
   *   "message": "I need legal consultation about contract law",
   *   "status": 1,
   *   "createdAt": "2024-01-15T10:30:00.000Z",
   *   "updatedAt": "2024-01-15T10:30:00.000Z"
   * }
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ 
    summary: 'Create a new order',
    description: 'Creates a new order with customer information and message'
  })
  @ApiBody({ type: CreateOrderDto })
  @ApiResponse({ 
    status: 201, 
    description: 'Order created successfully',
    type: OrderResponseDto
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Bad request - validation failed'
  })
  async create(@Body() createOrderDto: CreateOrderDto): Promise<OrderResponseDto> {
    return await this.orderRepository.create(createOrderDto);
  }

  /**
   * Get all orders
   * 
   * Retrieves orders from the database with optional pagination, sorting, and filtering.
   * Returns a list of orders with their complete information.
   * 
   * @param {number} page - Page number (default: 1)
   * @param {number} limit - Number of records per page (default: 10)
   * @param {string} sort - Sort field and direction (default: 'id,DESC')
   * @param {string[]} filter - Filter conditions (format: field||operator||value)
   * @returns {Promise<{data: OrderResponseDto[], count: number, total: number, page: number, pageCount: number}>} Paginated orders result
   * 
   * @example
   * GET /api/orders
   * GET /api/orders?page=1&limit=10&sort=id,DESC
   * GET /api/orders?filter=status||eq||1&filter=phone||cont||0661090777
   * Response: {
   *   "data": [
   *     {
   *       "id": "123e4567-e89b-12d3-a456-426614174000",
   *       "name": "John Doe",
   *       "phone": "+380961234567",
   *       "message": "I need legal consultation",
   *       "status": 1,
   *       "createdAt": "2024-01-15T10:30:00.000Z",
   *       "updatedAt": "2024-01-15T10:30:00.000Z"
   *     }
   *   ],
   *   "count": 10,
   *   "total": 25,
   *   "page": 1,
   *   "pageCount": 3
   * }
   */
  @Get()
  @ApiOperation({ 
    summary: 'Get all orders',
    description: 'Retrieves orders from the database with optional pagination, sorting, and filtering'
  })
  @ApiQuery({ 
    name: 'page', 
    required: false, 
    type: Number, 
    description: 'Page number (default: 1)',
    example: 1
  })
  @ApiQuery({ 
    name: 'limit', 
    required: false, 
    type: Number, 
    description: 'Number of records per page (default: 10)',
    example: 10
  })
  @ApiQuery({ 
    name: 'sort', 
    required: false, 
    type: String, 
    description: 'Sort field and direction (default: id,DESC)',
    example: 'id,DESC'
  })
  @ApiQuery({ 
    name: 'filter', 
    required: false, 
    type: [String], 
    description: 'Filter conditions (format: field||operator||value)',
    example: 'status||eq||1'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Orders retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: { $ref: '#/components/schemas/OrderResponseDto' }
        },
        count: { type: 'number', description: 'Number of records on current page' },
        total: { type: 'number', description: 'Total number of orders found' },
        page: { type: 'number', description: 'Current page number' },
        pageCount: { type: 'number', description: 'Total number of pages' }
      }
    }
  })
  async findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('sort') sort?: string,
    @Query('filter') filter?: string | string[],
  ): Promise<{
    data: OrderResponseDto[];
    count: number;
    total: number;
    page: number;
    pageCount: number;
  }> {
    // Parse query parameters with defaults
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 10;
    const sortParam = sort || 'id,DESC';
    
    // Parse filters
    const filters = filter ? (Array.isArray(filter) ? filter : [filter]) : [];
    
    return await this.orderRepository.findAllPaginated(pageNum, limitNum, sortParam, filters);
  }

  /**
   * Get order by ID
   * 
   * Retrieves a specific order by its unique identifier.
   * 
   * @param {string} id - Order unique identifier (UUID)
   * @returns {Promise<OrderResponseDto>} Order details
   * 
   * @throws {NotFoundException} When order with specified ID is not found
   * 
   * @example
   * GET /api/orders/123e4567-e89b-12d3-a456-426614174000
   * Response: {
   *   "id": "123e4567-e89b-12d3-a456-426614174000",
   *   "name": "John Doe",
   *   "phone": "+380961234567",
   *   "message": "I need legal consultation",
   *   "status": 1,
   *   "createdAt": "2024-01-15T10:30:00.000Z",
   *   "updatedAt": "2024-01-15T10:30:00.000Z"
   * }
   */
  @Get(':id')
  @ApiOperation({ 
    summary: 'Get order by ID',
    description: 'Retrieves a specific order by its unique identifier'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'Order unique identifier',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Order found successfully',
    type: OrderResponseDto
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Order not found'
  })
  async findOne(@Param('id') id: string): Promise<OrderResponseDto> {
    const order = await this.orderRepository.findById(id);
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return order;
  }

  /**
   * Update an existing order
   * 
   * Updates an existing order with new information.
   * Only provided fields will be updated, others remain unchanged.
   * 
   * @param {string} id - Order unique identifier (UUID)
   * @param {UpdateOrderDto} updateOrderDto - Order update data
   * @returns {Promise<OrderResponseDto>} Updated order details
   * 
   * @throws {NotFoundException} When order with specified ID is not found
   * @throws {BadRequestException} When validation fails
   * 
   * @example
   * PATCH /api/orders/123e4567-e89b-12d3-a456-426614174000
   * Body: {
   *   "status": 2,
   *   "message": "Updated message"
   * }
   * Response: {
   *   "id": "123e4567-e89b-12d3-a456-426614174000",
   *   "name": "John Doe",
   *   "phone": "+380961234567",
   *   "message": "Updated message",
   *   "status": 2,
   *   "createdAt": "2024-01-15T10:30:00.000Z",
   *   "updatedAt": "2024-01-15T11:30:00.000Z"
   * }
   */
  @Patch(':id')
  @ApiOperation({ 
    summary: 'Update order',
    description: 'Updates an existing order with new information'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'Order unique identifier',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @ApiBody({ type: UpdateOrderDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Order updated successfully',
    type: OrderResponseDto
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Order not found'
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Bad request - validation failed'
  })
  async update(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ): Promise<OrderResponseDto> {
    return await this.orderRepository.update(id, updateOrderDto);
  }

  /**
   * Delete an order
   * 
   * Permanently deletes an order from the database.
   * This action cannot be undone.
   * 
   * @param {string} id - Order unique identifier (UUID)
   * @returns {Promise<void>} No content on successful deletion
   * 
   * @throws {NotFoundException} When order with specified ID is not found
   * 
   * @example
   * DELETE /api/orders/123e4567-e89b-12d3-a456-426614174000
   * Response: 204 No Content
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ 
    summary: 'Delete order',
    description: 'Deletes an order by its unique identifier'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'Order unique identifier',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @ApiResponse({ 
    status: 204, 
    description: 'Order deleted successfully'
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Order not found'
  })
  async remove(@Param('id') id: string): Promise<void> {
    await this.orderRepository.delete(id);
  }
}