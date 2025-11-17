# FilterService Documentation

## Overview

The `FilterService` provides reusable filtering, sorting, and pagination functionality for any DynamoDB entity repository. It uses entity schema types for proper type conversion and DynamoDB FilterExpression for server-side filtering.

## Features

- ✅ **Type-aware filtering** - Uses entity schema for proper type conversion
- ✅ **Server-side filtering** - Uses DynamoDB FilterExpression
- ✅ **In-memory sorting** - Handles complex sorting logic
- ✅ **Pagination** - Standard pagination with metadata
- ✅ **Reusable** - Works with any entity/model
- ✅ **Extensible** - Easy to add new filter operators

## Usage

### 1. Inject FilterService in Repository

```typescript
import { FilterService } from '../../../services/filter.service';

@Injectable()
export class OrderRepository {
  constructor(
    @InjectModel('Order')
    private readonly orderModel: Model<Order, any>,
    private readonly filterService: FilterService,
  ) {}
}
```

### 2. Define Field Types (Auto-extracted from Schema)

```typescript
// Option A: Auto-extract from schema (Recommended)
private getFieldTypes(): Record<string, string> {
  return this.filterService.extractFieldTypes(this.orderModel);
}

// Option B: Manual definition (if auto-extraction fails)
private readonly fieldTypes: Record<string, string> = {
  id: 'String',
  name: 'String', 
  phone: 'String',
  message: 'String',
  status: 'Number',
  createdAt: 'Date',
  updatedAt: 'Date'
};
```

### 3. Use in Repository Method

```typescript
async findAllPaginated(
  page: number = 1, 
  limit: number = 10, 
  sort: string = 'id,DESC',
  filters: string[] = []
) {
  return await this.filterService.processQuery(
    this.orderModel,
    filters,
    this.fieldTypes,
    sort,
    page,
    limit
  );
}
```

## API Reference

### `processQuery(model, filters, fieldTypes, sort, page, limit)`

Complete query processing pipeline.

**Parameters:**
- `model` - DynamoDB model instance
- `filters` - Array of filter strings (format: `'field||operator||value'`)
- `fieldTypes` - Field type mapping from entity schema
- `sort` - Sort field and direction (e.g., `'createdAt,DESC'`)
- `page` - Page number (1-based)
- `limit` - Records per page

**Returns:**
```typescript
{
  data: any[],           // Paginated records
  count: number,         // Records on current page
  total: number,         // Total records (after filtering)
  page: number,          // Current page
  pageCount: number      // Total pages
}
```

### Individual Methods

#### `convertFilterValue(field, value, fieldTypes)`
Converts string values to appropriate types based on entity schema.

#### `applyDynamoDBFilters(scanQuery, filters, fieldTypes)`
Applies filters to DynamoDB scan query using FilterExpression.

#### `applySorting(data, sort)`
Sorts data array in memory.

#### `applyPagination(data, page, limit)`
Applies pagination to data array.

## Supported Filter Operators

| Operator | Description | Example |
|----------|-------------|---------|
| `eq` | Equal | `status||eq||1` |
| `ne` | Not equal | `status||ne||0` |
| `cont` | Contains | `name||cont||John` |
| `between` | Between (dates) | `createdAt||between||2024-01-01,2024-12-31` |
| `gt` | Greater than | `id||gt||100` |
| `gte` | Greater than or equal | `id||gte||100` |
| `lt` | Less than | `id||lt||100` |
| `lte` | Less than or equal | `id||lte||100` |
| `isnull` | Is NULL | `deletedAt||isnull` |
| `notnull` | Is NOT NULL | `email||notnull` |

## Supported Field Types

| Type | Conversion | Example |
|------|------------|---------|
| `String` | No conversion | `"John"` → `"John"` |
| `Number` | `Number(value)` | `"1"` → `1` |
| `Date` | `new Date(value)` | `"2024-01-01"` → `Date object` |
| `Boolean` | `value === 'true'` | `"true"` → `true` |

## Examples

### Basic Usage

```typescript
// Filter by status and name
const result = await filterService.processQuery(
  orderModel,
  ['status||eq||1', 'name||cont||John'],
  { status: 'Number', name: 'String' },
  'createdAt,DESC',
  1,
  10
);
```

### Date Range Filtering

```typescript
// Filter by date range
const result = await filterService.processQuery(
  orderModel,
  ['createdAt||between||2024-01-01T00:00:00.000Z,2024-12-31T23:59:59.999Z'],
  { createdAt: 'Date' },
  'createdAt,DESC',
  1,
  10
);
```

### Multiple Filters

```typescript
// Complex filtering
const result = await filterService.processQuery(
  userModel,
  [
    'isActive||eq||true',
    'role||eq||admin',
    'email||cont||@company.com'
  ],
  { isActive: 'Boolean', role: 'String', email: 'String' },
  'lastName,ASC',
  1,
  20
);
```

## Migration Guide

### From Old Repository Implementation

**Before:**
```typescript
// 200+ lines of filtering, sorting, pagination logic
async findAllPaginated(page, limit, sort, filters) {
  // Complex implementation...
}
```

**After:**
```typescript
// 10 lines using FilterService
async findAllPaginated(page, limit, sort, filters) {
  return await this.filterService.processQuery(
    this.model,
    filters,
    this.getFieldTypes(), // Auto-extracted from schema
    sort,
    page,
    limit
  );
}
```

## Benefits

1. **DRY Principle** - No code duplication across repositories
2. **Consistency** - Same filtering behavior everywhere
3. **Maintainability** - Single place to update filter logic
4. **Type Safety** - Schema-based type conversion
5. **Performance** - Server-side filtering with DynamoDB
6. **Extensibility** - Easy to add new operators or types

## Future Enhancements

- Extract field types directly from DynamoDB schema
- Add support for nested field filtering
- Implement caching for frequently used filters
- Add query optimization based on filter patterns
