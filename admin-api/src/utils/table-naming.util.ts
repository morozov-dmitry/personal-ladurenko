/**
 * Table Naming Utility
 *
 * Provides consistent table naming across all modules based on environment.
 * Centralizes the table naming logic to avoid duplication and ensure consistency.
 *
 * @fileoverview Utility functions for DynamoDB table naming
 * @author Lostal Development Team
 * @version 1.0.0
 */

/**
 * Get the full table name with environment prefix
 *
 * Constructs the complete table name using the environment prefix
 * and the base table name. This ensures consistent naming across
 * all environments (dev, staging, prod).
 *
 * @param {string} baseName - Base table name (e.g., 'orders', 'users', 'comments')
 * @returns {string} Full table name (e.g., 'lostal-dev-orders')
 *
 * @example
 * ```typescript
 * const ordersTable = getTableName('orders');
 * // Returns: 'lostal-dev-orders' (in development)
 *
 * const usersTable = getTableName('users');
 * // Returns: 'lostal-dev-users' (in development)
 * ```
 */
export function getTableName(baseName: string): string {
  const env = process.env.NODE_ENV || 'dev';
  return `lostal-${env}-${baseName}`;
}

/**
 * Get the current environment name
 *
 * @returns {string} Current environment (dev, staging, prod)
 */
export function getEnvironment(): string {
  return process.env.NODE_ENV || 'dev';
}

/**
 * Get the table prefix for the current environment
 *
 * @returns {string} Table prefix (e.g., 'lostal-dev')
 */
export function getTablePrefix(): string {
  const env = getEnvironment();
  return `lostal-${env}`;
}
