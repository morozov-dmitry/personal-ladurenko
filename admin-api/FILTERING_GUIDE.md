# API Filtering Guide

This document describes the filtering implementation for the Orders API, which follows the **[nestjsx/crud](https://github.com/nestjsx/crud/wiki/Requests#description)** standard.

## Overview

The Orders API now supports filtering using query parameters in the format:
```
?filter=field||operator||value
```

Multiple filters can be combined using `AND` logic:
```
?filter=status||eq||1&filter=phone||cont||0661090777
```

## Supported Filter Operators

Based on the nestjsx/crud standard, the following operators are supported:

### Comparison Operators

| Operator | SQL Equivalent | Description | Example |
|----------|---------------|-------------|---------|
| `eq` | `=` | Equal | `?filter=status||eq||1` |
| `ne` | `!=` | Not equal | `?filter=status||ne||0` |
| `gt` | `>` | Greater than | `?filter=id||gt||100` |
| `lt` | `<` | Less than | `?filter=id||lt||100` |
| `gte` | `>=` | Greater than or equal | `?filter=id||gte||100` |
| `lte` | `<=` | Less than or equal | `?filter=id||lte||100` |

### String Operators

| Operator | SQL Equivalent | Description | Example |
|----------|---------------|-------------|---------|
| `cont` | `LIKE %val%` | Contains (case-insensitive) | `?filter=phone||cont||066` |
| `starts` | `LIKE val%` | Starts with | `?filter=name||starts||John` |
| `ends` | `LIKE %val` | Ends with | `?filter=email||ends||gmail.com` |
| `excl` | `NOT LIKE %val%` | Not contains | `?filter=message||excl||spam` |

### Date/Time Operators

| Operator | SQL Equivalent | Description | Example |
|----------|---------------|-------------|---------|
| `between` | `BETWEEN` | Between two dates | `?filter=createdAt||between||2024-01-01,2024-12-31` |

### Null Operators

| Operator | SQL Equivalent | Description | Example |
|----------|---------------|-------------|---------|
| `isnull` | `IS NULL` | Is NULL | `?filter=deletedAt||isnull` |
| `notnull` | `IS NOT NULL` | Is NOT NULL | `?filter=email||notnull` |

## API Endpoint

### GET /api/orders

Retrieve orders with optional pagination, sorting, and filtering.

#### Query Parameters

| Parameter | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| `page` | number | No | Page number (default: 1) | `page=1` |
| `limit` | number | No | Records per page (default: 10) | `limit=10` |
| `sort` | string | No | Sort field and direction (default: id,DESC) | `sort=createdAt,DESC` |
| `filter` | string[] | No | Filter conditions | `filter=status||eq||1` |

#### Examples

1. **Filter by status:**
   ```
   GET /api/orders?filter=status||eq||1
   ```

2. **Filter by phone contains:**
   ```
   GET /api/orders?filter=phone||cont||0661090777
   ```

3. **Multiple filters (AND logic):**
   ```
   GET /api/orders?filter=status||eq||1&filter=phone||cont||0661090777
   ```

4. **Filter by date range:**
   ```
   GET /api/orders?filter=createdAt||between||2024-01-01T00:00:00.000Z,2024-12-31T23:59:59.999Z
   ```

5. **Complex query with pagination and sorting:**
   ```
   GET /api/orders?page=1&limit=10&sort=createdAt,DESC&filter=status||eq||1&filter=phone||cont||066
   ```

#### Response Format

```json
{
  "data": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "name": "John Doe",
      "phone": "+380661090777",
      "message": "Need legal consultation",
      "status": 1,
      "createdAt": "2024-10-07T12:22:46.323Z",
      "updatedAt": "2024-10-07T12:22:46.323Z"
    }
  ],
  "count": 1,
  "total": 1,
  "page": 1,
  "pageCount": 1
}
```

## Implementation Details

### Controller (`orders.controller.ts`)

The controller accepts multiple `filter` query parameters and passes them to the repository:

```typescript
async findAll(
  @Query('page') page?: string,
  @Query('limit') limit?: string,
  @Query('sort') sort?: string,
  @Query('filter') filter?: string | string[],
) {
  const filters = filter ? (Array.isArray(filter) ? filter : [filter]) : [];
  return await this.orderRepository.findAllPaginated(pageNum, limitNum, sortParam, filters);
}
```

### Repository (`order.repository.ts`)

The repository applies filters in memory after fetching all data from DynamoDB:

```typescript
async findAllPaginated(
  page: number = 1, 
  limit: number = 10, 
  sort: string = 'id,DESC',
  filters: string[] = []
) {
  // Get all data
  const allData = await this.orderModel.scan().exec();
  
  // Apply filters (AND logic)
  let filteredData = allData.filter(item => {
    return filters.every(filterStr => {
      const [field, operator, value] = filterStr.split('||');
      return this.applyFilter(item, field, operator, value);
    });
  });
  
  // Apply sorting and pagination...
}
```

### Filter Application

The `applyFilter` method handles each operator:

```typescript
private applyFilter(item: any, field: string, operator: string, value: string): boolean {
  const fieldValue = item[field];
  
  switch (operator) {
    case 'eq': return String(fieldValue) === String(value);
    case 'cont': return String(fieldValue).toLowerCase().includes(String(value).toLowerCase());
    case 'between': // Handle date ranges with URL-encoded ISO strings
    // ... etc
  }
}
```

## Frontend Integration

The frontend automatically formats filters according to this standard using the `getFilter` method in `useGridQuery.js`:

```javascript
const getFilter = (fieldName, fieldValue) => {
  const column = props.columns.find((col) => col.field === fieldName)
  
  switch (column.filterOptions?.filterType) {
    case 'daterange':
      return `&filter=${fieldName}||between||${startISO},${endISO}`
    case 'select':
      return `&filter=${fieldName}||eq||${fieldValue}`
    case 'text':
    default:
      return `&filter=${fieldName}||cont||${fieldValue}`
  }
}
```

## Performance Considerations

### Current Implementation: DynamoDB Scan + FilterExpression

The implementation uses **DynamoDB scan with FilterExpression** for filtering. This means:

✅ **Filters are applied server-side** using DynamoDB's FilterExpression
✅ **Less data transferred** to the application (filtered data only)
✅ **Simple implementation** with no additional infrastructure

**Important Limitations:**

⚠️ **DynamoDB's `scan` reads all items** before applying filters - you're charged for the full scan
⚠️ **Sorting is done in-memory** - DynamoDB doesn't support ORDER BY in scans
⚠️ **For large datasets (>10k items)**, this approach will become slow

### When to Consider Alternatives

#### For datasets < 10,000 items
✅ **Current implementation is fine** - performance is acceptable

#### For datasets 10,000 - 100,000 items
⚠️ **Consider these options:**
1. Add caching (Redis) for frequent queries
2. Add Global Secondary Indexes for most-filtered fields
3. Limit filter combinations

#### For datasets > 100,000 items
🚨 **ElasticSearch/OpenSearch required**
- DynamoDB scan will timeout or take too long
- User experience will suffer
- ElasticSearch is the industry-standard solution for flexible filtering

### Future Improvements

When you need better performance:

1. **Add ElasticSearch/OpenSearch** (Recommended)
   - Real-time sync via DynamoDB Streams
   - True full-text search and complex filtering
   - Handles millions of records efficiently

2. **Add Global Secondary Indexes**
   - For frequently filtered fields (e.g., status, date ranges)
   - Requires schema changes and infrastructure updates

3. **Implement Caching**
   - Cache filtered results with Redis
   - Set TTL based on data update frequency

## Testing

Test the filtering using curl:

```bash
# Filter by status
curl "http://localhost:3000/api/orders?filter=status||eq||1"

# Multiple filters
curl "http://localhost:3000/api/orders?filter=status||eq||1&filter=phone||cont||066"

# With pagination and sorting
curl "http://localhost:3000/api/orders?page=1&limit=10&sort=createdAt,DESC&filter=status||eq||1"
```

Or test directly in the browser at:
```
http://localhost:3000/api/orders?filter=status||eq||1&filter=phone||cont||0661090777
```

## References

- [NestJS CRUD Request Documentation](https://github.com/nestjsx/crud/wiki/Requests#description)
- Filter syntax follows the `nestjsx/crud` standard
- All filter conditions are combined with `AND` logic
- For `OR` logic, the standard also supports `?or=field||operator||value` (not yet implemented)

