import { Injectable } from '@nestjs/common';

/**
 * Generic Filter Service
 * 
 * Provides reusable filtering, sorting, and pagination functionality
 * for any entity repository. Uses entity schema types for proper
 * type conversion and DynamoDB FilterExpression for server-side filtering.
 * 
 * @class FilterService
 * @author Lostal Development Team
 * @version 1.0.0
 */
@Injectable()
export class FilterService {
  /**
   * Extract field types from DynamoDB schema
   * 
   * @param {any} model - DynamoDB model with schema
   * @returns {Record<string, string>} Field type mapping
   * 
   * @example
   * const fieldTypes = filterService.extractFieldTypes(orderModel);
   * // Returns: { id: 'String', name: 'String', status: 'Number', ... }
   */
  extractFieldTypes(model: any): Record<string, string> {
    const fieldTypes: Record<string, string> = {};
    
    try {
      // Try different ways to access the schema
      let schema = null;
      
      if (model && model.schema) {
        schema = model.schema;
      } else if (model && model.$__ && model.$__.schema) {
        schema = model.$__.schema;
      } else if (model && model.constructor && model.constructor.schema) {
        schema = model.constructor.schema;
      }
      
      if (!schema || !schema.attributes) {
        console.warn('Could not extract field types from model schema, using fallback');
        return {};
      }
      
      // Extract field types from schema attributes
      Object.keys(schema.attributes).forEach(fieldName => {
        const field = schema.attributes[fieldName];
        
        if (field && field.type) {
          // Map DynamoDB schema types to our filter types
          switch (field.type.name) {
            case 'String':
              fieldTypes[fieldName] = 'String';
              break;
            case 'Number':
              fieldTypes[fieldName] = 'Number';
              break;
            case 'Date':
              fieldTypes[fieldName] = 'Date';
              break;
            case 'Boolean':
              fieldTypes[fieldName] = 'Boolean';
              break;
            default:
              fieldTypes[fieldName] = 'String'; // Default fallback
          }
        }
      });
      
      return fieldTypes;
    } catch (error) {
      console.warn('Error extracting field types from model:', error);
      return {};
    }
  }
  /**
   * Convert filter value to appropriate type based on entity schema
   * 
   * @param {string} field - The field name
   * @param {string} value - The filter value as string
   * @param {Record<string, string>} fieldTypes - Field type mapping from entity schema
   * @returns {any} Converted value based on entity schema
   * 
   * @example
   * const value = filterService.convertFilterValue('status', '1', { status: 'Number' });
   * // Returns: 1 (number)
   */
  convertFilterValue(field: string, value: string, fieldTypes: Record<string, string>): any {
    const fieldType = fieldTypes[field];
    
    switch (fieldType) {
      case 'Number':
        return Number(value);
      
      case 'Date':
        return new Date(value);
      
      case 'Boolean':
        return value.toLowerCase() === 'true';
      
      case 'String':
      default:
        return value;
    }
  }

  /**
   * Apply filters to DynamoDB scan query using FilterExpression
   * 
   * @param {any} scanQuery - The DynamoDB scan query
   * @param {string[]} filters - Array of filter strings (format: 'field||operator||value')
   * @param {Record<string, string>} fieldTypes - Field type mapping from entity schema
   * @returns {any} Modified scan query with filters applied
   * 
   * @example
   * const filteredQuery = filterService.applyDynamoDBFilters(
   *   model.scan(), 
   *   ['status||eq||1', 'name||cont||John'],
   *   { status: 'Number', name: 'String' }
   * );
   */
  applyDynamoDBFilters(scanQuery: any, filters: string[], fieldTypes: Record<string, string>): any {
    filters.forEach(filterStr => {
      const [field, operator, value] = filterStr.split('||');
      
      switch (operator) {
        case 'eq': // Equal
          const filterValue = this.convertFilterValue(field, value, fieldTypes);
          scanQuery = scanQuery.where(field).eq(filterValue);
          break;
        
        case 'ne': // Not equal
          const neFilterValue = this.convertFilterValue(field, value, fieldTypes);
          scanQuery = scanQuery.where(field).ne(neFilterValue);
          break;
        
        case 'cont': // Contains (case-sensitive in DynamoDB)
          scanQuery = scanQuery.where(field).contains(value);
          break;
        
        case 'between': // Between (for dates)
          if (value.includes(',')) {
            const [start, end] = value.split(',').map(v => decodeURIComponent(v));
            scanQuery = scanQuery.where(field).between(start, end);
          }
          break;
        
        case 'gt': // Greater than
          const gtValue = this.convertFilterValue(field, value, fieldTypes);
          scanQuery = scanQuery.where(field).gt(gtValue);
          break;
        
        case 'gte': // Greater than or equal
          const gteValue = this.convertFilterValue(field, value, fieldTypes);
          scanQuery = scanQuery.where(field).ge(gteValue);
          break;
        
        case 'lt': // Less than
          const ltValue = this.convertFilterValue(field, value, fieldTypes);
          scanQuery = scanQuery.where(field).lt(ltValue);
          break;
        
        case 'lte': // Less than or equal
          const lteValue = this.convertFilterValue(field, value, fieldTypes);
          scanQuery = scanQuery.where(field).le(lteValue);
          break;
        
        case 'isnull': // Is NULL
          scanQuery = scanQuery.where(field).null();
          break;
        
        case 'notnull': // Is NOT NULL
          scanQuery = scanQuery.where(field).not().null();
          break;
        
        default:
          // Unknown operator, skip this filter
          break;
      }
    });
    
    return scanQuery;
  }

  /**
   * Apply sorting to data array in memory
   * 
   * @param {any[]} data - Array of data to sort
   * @param {string} sort - Sort field and direction (e.g., 'id,DESC' or 'createdAt,ASC')
   * @returns {any[]} Sorted data array
   * 
   * @example
   * const sortedData = filterService.applySorting(data, 'createdAt,DESC');
   */
  applySorting(data: any[], sort: string): any[] {
    if (!sort) return data;
    
    const [sortField, sortDirection] = sort.split(',');
    const isDesc = sortDirection?.toUpperCase() === 'DESC';
    
    return [...data].sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      // Handle different data types
      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return isDesc ? bValue.localeCompare(aValue) : aValue.localeCompare(bValue);
      }
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return isDesc ? bValue - aValue : aValue - bValue;
      }
      
      if (aValue instanceof Date && bValue instanceof Date) {
        return isDesc ? bValue.getTime() - aValue.getTime() : aValue.getTime() - bValue.getTime();
      }
      
      // Convert to string for comparison
      const aStr = String(aValue);
      const bStr = String(bValue);
      return isDesc ? bStr.localeCompare(aStr) : aStr.localeCompare(bStr);
    });
  }

  /**
   * Apply pagination to data array
   * 
   * @param {any[]} data - Array of data to paginate
   * @param {number} page - Page number (1-based)
   * @param {number} limit - Number of records per page
   * @returns {{data: any[], count: number, total: number, page: number, pageCount: number}} Paginated result
   * 
   * @example
   * const result = filterService.applyPagination(data, 1, 10);
   */
  applyPagination(data: any[], page: number, limit: number): {
    data: any[];
    count: number;
    total: number;
    page: number;
    pageCount: number;
  } {
    const total = data.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedData = data.slice(startIndex, endIndex);
    const pageCount = Math.ceil(total / limit);
    
    return {
      data: paginatedData,
      count: paginatedData.length,
      total,
      page,
      pageCount
    };
  }

  /**
   * Complete filtering, sorting, and pagination pipeline
   * 
   * @param {any} model - DynamoDB model
   * @param {string[]} filters - Array of filter strings
   * @param {Record<string, string>} fieldTypes - Field type mapping
   * @param {string} sort - Sort field and direction
   * @param {number} page - Page number
   * @param {number} limit - Records per page
   * @returns {Promise<{data: any[], count: number, total: number, page: number, pageCount: number}>} Complete result
   * 
   * @example
   * const result = await filterService.processQuery(
   *   orderModel,
   *   ['status||eq||1'],
   *   { status: 'Number', name: 'String' },
   *   'createdAt,DESC',
   *   1,
   *   10
   * );
   */
  async processQuery(
    model: any,
    filters: string[],
    fieldTypes: Record<string, string>,
    sort: string,
    page: number,
    limit: number
  ): Promise<{
    data: any[];
    count: number;
    total: number;
    page: number;
    pageCount: number;
  }> {
    // Build scan query with filters
    let scanQuery = model.scan();
    
    if (filters && filters.length > 0) {
      scanQuery = this.applyDynamoDBFilters(scanQuery, filters, fieldTypes);
    }
    
    // Execute scan
    const allData = await scanQuery.exec();
    
    // Apply sorting
    const sortedData = this.applySorting(allData, sort);
    
    // Apply pagination
    return this.applyPagination(sortedData, page, limit);
  }
}
