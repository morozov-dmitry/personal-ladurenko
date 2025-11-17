import { Schema } from 'dynamoose';
import { randomUUID } from 'crypto';

/**
 * Comment entity schema for DynamoDB
 *
 * Defines the structure and validation rules for comment documents in DynamoDB.
 * Includes bilingual support for Ukrainian and Russian content, rating system,
 * and automatic timestamp management for creation and update tracking.
 *
 * @constant {Schema} CommentSchema
 * @example
 * ```typescript
 * // Create a new comment document
 * const comment = new CommentModel({
 *   name: "Іван Петренко",
 *   nameRu: "Иван Петренко",
 *   message: "Дуже задоволений якістю послуг!",
 *   messageRu: "Очень доволен качеством услуг!",
 *   photo: "https://example.com/photo.jpg",
 *   score: 5,
 *   status: 1
 * });
 * ```
 */
export const CommentSchema = new Schema(
  {
    /**
     * Unique identifier for the comment
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
     * Comment author name in Ukrainian
     *
     * @type {String}
     * @required Must be provided
     */
    name: {
      type: String,
      required: true,
    },
    /**
     * Comment author name in Russian
     *
     * @type {String}
     * @required Must be provided
     */
    nameRu: {
      type: String,
      required: true,
    },
    /**
     * Comment message content in Ukrainian
     *
     * @type {String}
     * @required Must be provided
     */
    message: {
      type: String,
      required: true,
    },
    /**
     * Comment message content in Russian
     *
     * @type {String}
     * @required Must be provided
     */
    messageRu: {
      type: String,
      required: true,
    },
    /**
     * URL of the comment author's photo
     *
     * @type {String}
     * @required Must be provided
     */
    photo: {
      type: String,
      required: true,
    },
    /**
     * Status of the comment (1 = approved, 0 = pending, etc.)
     *
     * @type {Number}
     * @default 1 (approved)
     */
    status: {
      type: Number,
      default: 1,
    },
    /**
     * Rating score for the comment (1-5 scale)
     *
     * @type {Number}
     * @required Must be provided
     * @minimum 1
     * @maximum 5
     */
    score: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  },
);

/**
 * Comment model interface
 *
 * TypeScript interface defining the structure of a comment document.
 * Used for type safety and IntelliSense support throughout the application.
 *
 * @interface Comment
 * @example
 * ```typescript
 * const comment: Comment = {
 *   id: "123e4567-e89b-12d3-a456-426614174000",
 *   name: "Іван Петренко",
 *   nameRu: "Иван Петренко",
 *   message: "Дуже задоволений якістю послуг!",
 *   messageRu: "Очень доволен качеством услуг!",
 *   photo: "https://example.com/photo.jpg",
 *   status: 1,
 *   score: 5,
 *   createdAt: new Date(),
 *   updatedAt: new Date()
 * };
 * ```
 */
export interface Comment {
  /** Unique identifier for the comment */
  id: string;
  /** Comment author name in Ukrainian */
  name: string;
  /** Comment author name in Russian */
  nameRu: string;
  /** Comment message content in Ukrainian */
  message: string;
  /** Comment message content in Russian */
  messageRu: string;
  /** URL of the comment author's photo */
  photo: string;
  /** Status of the comment */
  status: number;
  /** Rating score for the comment (1-5 scale) */
  score: number;
  /** Date and time when the comment was created */
  createdAt: Date;
  /** Date and time when the comment was last updated */
  updatedAt: Date;
}
