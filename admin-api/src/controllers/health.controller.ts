import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { DynamoDBService } from '../services/dynamodb.service';

/**
 * Health Controller
 *
 * Provides health check endpoints for monitoring system status and dependencies.
 * Essential for monitoring, load balancers, and DevOps operations.
 *
 * @class HealthController
 * @author Lostal Development Team
 * @version 1.0.0
 */
@ApiTags('health')
@Controller('health')
export class HealthController {
  /**
   * Creates an instance of HealthController.
   *
   * @param {DynamoDBService} dynamoDBService - Service for DynamoDB health checks
   */
  constructor(private readonly dynamoDBService: DynamoDBService) {}

  /**
   * Get overall system health status
   *
   * Performs a comprehensive health check of the entire system including:
   * - DynamoDB connection status
   * - Environment information
   * - Service availability
   *
   * @returns {Promise<Object>} Health status object containing:
   * - status: 'OK' | 'DEGRADED' - Overall system status
   * - timestamp: ISO string of current time
   * - environment: Current environment (development/staging/production)
   * - version: API version
   * - services: Object containing service-specific health information
   *
   * @example
   * GET /api/health
   * Response: {
   *   "status": "OK",
   *   "timestamp": "2024-01-15T10:30:00.000Z",
   *   "environment": "development",
   *   "version": "1.0.0",
   *   "services": {
   *     "dynamodb": { "status": "healthy", "connected": true }
   *   }
   * }
   */
  @Get()
  @ApiOperation({
    summary: 'Get overall system health',
    description:
      'Returns the overall health status of the system including DynamoDB connection status',
  })
  @ApiResponse({
    status: 200,
    description: 'Health check successful',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'OK' },
        timestamp: { type: 'string', example: '2024-01-15T10:30:00.000Z' },
        environment: { type: 'string', example: 'development' },
        version: { type: 'string', example: '1.0.0' },
        services: {
          type: 'object',
          properties: {
            dynamodb: {
              type: 'object',
              properties: {
                status: { type: 'string', example: 'healthy' },
                region: { type: 'string', example: 'eu-central-1' },
                environment: { type: 'string', example: 'development' },
                connected: { type: 'boolean', example: true },
              },
            },
          },
        },
      },
    },
  })
  async getHealth() {
    const dynamoDBHealth = await this.dynamoDBService.healthCheck();

    return {
      status: dynamoDBHealth.connected ? 'OK' : 'DEGRADED',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      version: '1.0.0',
      services: {
        dynamodb: dynamoDBHealth,
      },
    };
  }

  /**
   * Get DynamoDB-specific health status
   *
   * Provides detailed information about DynamoDB connection and configuration.
   * Useful for debugging database connectivity issues.
   *
   * @returns {Promise<Object>} DynamoDB health object containing:
   * - status: 'healthy' | 'unhealthy' - DynamoDB connection status
   * - region: AWS region where DynamoDB is located
   * - environment: Current environment
   * - connected: Boolean indicating if connection is active
   *
   * @example
   * GET /api/health/dynamodb
   * Response: {
   *   "status": "healthy",
   *   "region": "eu-central-1",
   *   "environment": "development",
   *   "connected": true
   * }
   */
  @Get('dynamodb')
  @ApiOperation({
    summary: 'Get DynamoDB health status',
    description:
      'Returns detailed DynamoDB connection and configuration status',
  })
  @ApiResponse({
    status: 200,
    description: 'DynamoDB health check successful',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'healthy' },
        region: { type: 'string', example: 'eu-central-1' },
        environment: { type: 'string', example: 'development' },
        connected: { type: 'boolean', example: true },
      },
    },
  })
  async getDynamoDBHealth() {
    return await this.dynamoDBService.healthCheck();
  }
}
