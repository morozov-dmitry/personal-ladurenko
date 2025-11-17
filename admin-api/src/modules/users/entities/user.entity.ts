import { Schema } from 'dynamoose';
import { randomUUID } from 'crypto';

/**
 * User entity schema for DynamoDB
 *
 * Defines the structure and validation rules for user documents in DynamoDB.
 * Includes indexes for efficient querying by username and email, and automatic
 * timestamp management for creation and update tracking.
 *
 * @constant {Schema} UserSchema
 * @example
 * ```typescript
 * // Create a new user document
 * const user = new UserModel({
 *   username: "john_doe",
 *   password: "hashedPassword",
 *   name: "John Doe",
 *   town: "Kyiv",
 *   address: "123 Main Street",
 *   email: "john@example.com",
 *   phone: "+380961234567"
 * });
 * ```
 */
export const UserSchema = new Schema(
  {
    /**
     * Unique identifier for the user
     *
     * @type {String}
     * @hashKey Primary key for the table
     * @default Auto-generated UUID v4
     */
    id: {
      type: String,
      hashKey: true,
      default: () => randomUUID(),
    },
    /**
     * Username for the user account (must be unique)
     *
     * @type {String}
     * @required Must be provided
     * @index Global secondary index for efficient lookups
     */
    username: {
      type: String,
      required: true,
      index: {
        name: 'username-index',
        type: 'global',
      },
    },
    /**
     * Hashed password for the user account
     *
     * @type {String}
     * @required Must be provided
     */
    password: {
      type: String,
      required: true,
    },
    /**
     * Status of the user account (1 = active, 0 = inactive, etc.)
     *
     * @type {Number}
     * @default 1 (active)
     */
    status: {
      type: Number,
      default: 1,
    },
    /**
     * Full name of the user (optional)
     *
     * @type {String}
     * @optional May be null or undefined
     */
    name: {
      type: String,
    },
    /**
     * Town or city where the user is located
     *
     * @type {String}
     * @required Must be provided
     */
    town: {
      type: String,
      required: true,
    },
    /**
     * Physical address of the user
     *
     * @type {String}
     * @required Must be provided
     */
    address: {
      type: String,
      required: true,
    },
    /**
     * Email address of the user (optional)
     *
     * @type {String}
     * @optional May be null or undefined
     * @index Global secondary index for efficient lookups
     */
    email: {
      type: String,
      index: {
        name: 'email-index',
        type: 'global',
      },
    },
    /**
     * Phone number of the user
     *
     * @type {String}
     * @required Must be provided
     */
    phone: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  },
);

/**
 * User model interface
 *
 * TypeScript interface defining the structure of a user document.
 * Used for type safety and IntelliSense support throughout the application.
 *
 * @interface User
 * @example
 * ```typescript
 * const user: User = {
 *   id: "123e4567-e89b-12d3-a456-426614174000",
 *   username: "john_doe",
 *   password: "hashedPassword",
 *   status: 1,
 *   name: "John Doe",
 *   town: "Kyiv",
 *   address: "123 Main Street",
 *   email: "john@example.com",
 *   phone: "+380961234567",
 *   createdAt: new Date(),
 *   updatedAt: new Date()
 * };
 * ```
 */
export interface User {
  /** Unique identifier for the user */
  id: string;
  /** Username for the user account */
  username: string;
  /** Hashed password for the user account */
  password: string;
  /** Status of the user account */
  status: number;
  /** Full name of the user (optional) */
  name?: string;
  /** Town or city where the user is located */
  town: string;
  /** Physical address of the user */
  address: string;
  /** Email address of the user (optional) */
  email?: string;
  /** Phone number of the user */
  phone: string;
  /** Date and time when the user was created */
  createdAt: Date;
  /** Date and time when the user was last updated */
  updatedAt: Date;
}
