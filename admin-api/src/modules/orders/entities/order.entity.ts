import { Schema } from 'dynamoose';
import { randomUUID } from 'crypto';

/**
 * Order Entity Schema
 *
 * Defines the DynamoDB schema for Order entities.
 * Represents customer orders with contact information and status tracking.
 *
 * @fileoverview Order entity schema and interface definitions
 * @author Lostal Development Team
 * @version 1.0.0
 */

/**
 * DynamoDB Schema for Order entities
 *
 * Defines the structure and constraints for order records in DynamoDB.
 * Includes automatic UUID generation, timestamps, and indexing for efficient queries.
 *
 * @constant {Schema} OrderSchema
 *
 * @example
 * // Schema structure:
 * {
 *   id: String (hashKey, auto-generated UUID),
 *   name: String (required, customer name),
 *   phone: String (required, customer phone),
 *   message: String (required, order message),
 *   status: Number (default: 1, order status),
 *   createdAt: Date (default: now, indexed for queries),
 *   updatedAt: Date (auto-managed by timestamps)
 * }
 */
export const OrderSchema = new Schema(
  {
    /**
     * Order unique identifier
     * @type {String}
     * @description Primary key (hash key) for the order record
     */
  id: {
    type: String,
    hashKey: true,
    default: () => randomUUID(),
  },

    /**
     * Customer name
     * @type {String}
     * @description Full name of the customer placing the order
     */
    name: {
      type: String,
      required: true,
    },

    /**
     * Customer phone number
     * @type {String}
     * @description Contact phone number for the customer
     */
    phone: {
      type: String,
      required: true,
    },

    /**
     * Order message/description
     * @type {String}
     * @description Detailed message or description of the legal service requested
     */
    message: {
      type: String,
      required: true,
    },

    /**
     * Order status
     * @type {Number}
     * @description Current status of the order (1: New, 2: In Progress, 3: Completed, etc.)
     * @default 1
     */
    status: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  },
);

/**
 * Order Model Interface
 *
 * TypeScript interface defining the structure of Order documents.
 * Used for type safety and IDE autocompletion.
 *
 * @interface Order
 * @description Represents a customer order with all required fields
 *
 * @example
 * const order: Order = {
 *   id: '123e4567-e89b-12d3-a456-426614174000',
 *   name: 'John Doe',
 *   phone: '+380961234567',
 *   message: 'I need legal consultation about contract law',
 *   status: 1,
 *   createdAt: new Date('2024-01-15T10:30:00.000Z'),
 *   updatedAt: new Date('2024-01-15T10:30:00.000Z')
 * };
 */
export interface Order {
  /** Unique identifier for the order (UUID) */
  id: string;

  /** Customer's full name */
  name: string;

  /** Customer's phone number */
  phone: string;

  /** Order message/description */
  message: string;

  /** Order status (1: New, 2: In Progress, 3: Completed, etc.) */
  status: number;

  /** When the order was created */
  createdAt: Date;

  /** When the order was last updated */
  updatedAt: Date;
}
