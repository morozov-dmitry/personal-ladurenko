import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsNumber, IsUrl, Min, Max } from 'class-validator';
import { Exclude } from 'class-transformer';

/**
 * Data Transfer Object for creating a new comment
 * 
 * Contains all required fields for comment creation with bilingual support
 * (Ukrainian and Russian). Includes validation rules and API documentation.
 * 
 * @class CreateCommentDto
 * @example
 * ```typescript
 * const createCommentDto: CreateCommentDto = {
 *   name: "Іван Петренко",
 *   nameRu: "Иван Петренко",
 *   message: "Дуже задоволений якістю послуг!",
 *   messageRu: "Очень доволен качеством услуг!",
 *   photo: "https://example.com/photo.jpg",
 *   score: 5,
 *   status: 1
 * };
 * ```
 */
export class CreateCommentDto {
  /**
   * Comment author name in Ukrainian
   * 
   * @type {string}
   * @example "Іван Петренко"
   */
  @ApiProperty({
    description: 'Comment author name (Ukrainian)',
    example: 'Іван Петренко',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  /**
   * Comment author name in Russian
   * 
   * @type {string}
   * @example "Иван Петренко"
   */
  @ApiProperty({
    description: 'Comment author name (Russian)',
    example: 'Иван Петренко',
  })
  @IsString()
  @IsNotEmpty()
  nameRu: string;

  /**
   * Comment message content in Ukrainian
   * 
   * @type {string}
   * @example "Дуже задоволений якістю послуг!"
   */
  @ApiProperty({
    description: 'Comment message (Ukrainian)',
    example: 'Дуже задоволений якістю послуг!',
  })
  @IsString()
  @IsNotEmpty()
  message: string;

  /**
   * Comment message content in Russian
   * 
   * @type {string}
   * @example "Очень доволен качеством услуг!"
   */
  @ApiProperty({
    description: 'Comment message (Russian)',
    example: 'Очень доволен качеством услуг!',
  })
  @IsString()
  @IsNotEmpty()
  messageRu: string;

  /**
   * URL of the comment author's photo
   * 
   * @type {string}
   * @example "https://example.com/photo.jpg"
   */
  @ApiProperty({
    description: 'Comment author photo URL',
    example: 'https://example.com/photo.jpg',
  })
  @IsString()
  @IsNotEmpty()
  @IsUrl()
  photo: string;

  /**
   * Rating score for the comment (1-5 scale)
   * 
   * @type {number}
   * @example 5
   * @minimum 1
   * @maximum 5
   */
  @ApiProperty({
    description: 'Comment rating score (1-5)',
    example: 5,
    minimum: 1,
    maximum: 5,
  })
  @IsNumber()
  @Min(1)
  @Max(5)
  score: number;

  /**
   * Status of the comment (optional, defaults to 1)
   * 
   * @type {number}
   * @example 1
   * @default 1
   * @optional
   */
  @ApiProperty({
    description: 'Comment status',
    example: 1,
    default: 1,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  status?: number;
}

/**
 * Data Transfer Object for updating an existing comment
 * 
 * Contains optional fields for comment updates. All fields are optional
 * to allow partial updates. Includes validation rules and API documentation.
 * 
 * @class UpdateCommentDto
 * @example
 * ```typescript
 * const updateCommentDto: UpdateCommentDto = {
 *   score: 4,
 *   status: 2
 * };
 * ```
 */
export class UpdateCommentDto {
  /**
   * Comment unique identifier (excluded from updates)
   * @description Auto-generated UUID for the comment - excluded from update operations
   */
  @Exclude()
  id?: string;

  /**
   * Comment author name in Ukrainian (optional)
   * 
   * @type {string}
   * @example "Іван Петренко"
   * @optional
   */
  @ApiProperty({
    description: 'Comment author name (Ukrainian)',
    example: 'Іван Петренко',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;

  /**
   * Comment author name in Russian (optional)
   * 
   * @type {string}
   * @example "Иван Петренко"
   * @optional
   */
  @ApiProperty({
    description: 'Comment author name (Russian)',
    example: 'Иван Петренко',
    required: false,
  })
  @IsOptional()
  @IsString()
  nameRu?: string;

  /**
   * Comment message content in Ukrainian (optional)
   * 
   * @type {string}
   * @example "Дуже задоволений якістю послуг!"
   * @optional
   */
  @ApiProperty({
    description: 'Comment message (Ukrainian)',
    example: 'Дуже задоволений якістю послуг!',
    required: false,
  })
  @IsOptional()
  @IsString()
  message?: string;

  /**
   * Comment message content in Russian (optional)
   * 
   * @type {string}
   * @example "Очень доволен качеством услуг!"
   * @optional
   */
  @ApiProperty({
    description: 'Comment message (Russian)',
    example: 'Очень доволен качеством услуг!',
    required: false,
  })
  @IsOptional()
  @IsString()
  messageRu?: string;

  /**
   * URL of the comment author's photo (optional)
   * 
   * @type {string}
   * @example "https://example.com/photo.jpg"
   * @optional
   */
  @ApiProperty({
    description: 'Comment author photo URL',
    example: 'https://example.com/photo.jpg',
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsUrl()
  photo?: string;

  /**
   * Rating score for the comment (1-5 scale) (optional)
   * 
   * @type {number}
   * @example 5
   * @minimum 1
   * @maximum 5
   * @optional
   */
  @ApiProperty({
    description: 'Comment rating score (1-5)',
    example: 5,
    minimum: 1,
    maximum: 5,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  score?: number;

  /**
   * Status of the comment (optional)
   * 
   * @type {number}
   * @example 1
   * @optional
   */
  @ApiProperty({
    description: 'Comment status',
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  status?: number;

  /**
   * Comment creation date (excluded from updates)
   * @description When the comment was created - excluded from update operations
   */
  @Exclude()
  createdAt?: Date;

  /**
   * Comment last update date (excluded from updates)
   * @description When the comment was last updated - excluded from update operations
   */
  @Exclude()
  updatedAt?: Date;
}

/**
 * Data Transfer Object for comment response data
 * 
 * Contains all comment information returned by the API, including system-generated
 * fields like ID, timestamps, and computed properties.
 * 
 * @class CommentResponseDto
 * @example
 * ```typescript
 * const commentResponse: CommentResponseDto = {
 *   id: "123e4567-e89b-12d3-a456-426614174000",
 *   name: "Іван Петренко",
 *   nameRu: "Иван Петренко",
 *   message: "Дуже задоволений якістю послуг!",
 *   messageRu: "Очень доволен качеством услуг!",
 *   photo: "https://example.com/photo.jpg",
 *   score: 5,
 *   status: 1,
 *   createdAt: new Date("2024-01-15T10:30:00.000Z"),
 *   updatedAt: new Date("2024-01-15T10:30:00.000Z")
 * };
 * ```
 */
export class CommentResponseDto {
  /**
   * Unique identifier of the comment
   * 
   * @type {string}
   * @example "123e4567-e89b-12d3-a456-426614174000"
   */
  @ApiProperty({
    description: 'Comment unique identifier',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  /**
   * Comment author name in Ukrainian
   * 
   * @type {string}
   * @example "Іван Петренко"
   */
  @ApiProperty({
    description: 'Comment author name (Ukrainian)',
    example: 'Іван Петренко',
  })
  name: string;

  /**
   * Comment author name in Russian
   * 
   * @type {string}
   * @example "Иван Петренко"
   */
  @ApiProperty({
    description: 'Comment author name (Russian)',
    example: 'Иван Петренко',
  })
  nameRu: string;

  /**
   * Comment message content in Ukrainian
   * 
   * @type {string}
   * @example "Дуже задоволений якістю послуг!"
   */
  @ApiProperty({
    description: 'Comment message (Ukrainian)',
    example: 'Дуже задоволений якістю послуг!',
  })
  message: string;

  /**
   * Comment message content in Russian
   * 
   * @type {string}
   * @example "Очень доволен качеством услуг!"
   */
  @ApiProperty({
    description: 'Comment message (Russian)',
    example: 'Очень доволен качеством услуг!',
  })
  messageRu: string;

  /**
   * URL of the comment author's photo
   * 
   * @type {string}
   * @example "https://example.com/photo.jpg"
   */
  @ApiProperty({
    description: 'Comment author photo URL',
    example: 'https://example.com/photo.jpg',
  })
  photo: string;

  /**
   * Rating score for the comment
   * 
   * @type {number}
   * @example 5
   */
  @ApiProperty({
    description: 'Comment rating score',
    example: 5,
  })
  score: number;

  /**
   * Status of the comment
   * 
   * @type {number}
   * @example 1
   */
  @ApiProperty({
    description: 'Comment status',
    example: 1,
  })
  status: number;

  /**
   * Date and time when the comment was created
   * 
   * @type {Date}
   * @example "2024-01-15T10:30:00.000Z"
   */
  @ApiProperty({
    description: 'Comment creation date',
    example: '2024-01-15T10:30:00.000Z',
  })
  createdAt: Date;

  /**
   * Date and time when the comment was last updated
   * 
   * @type {Date}
   * @example "2024-01-15T10:30:00.000Z"
   */
  @ApiProperty({
    description: 'Comment last update date',
    example: '2024-01-15T10:30:00.000Z',
  })
  updatedAt: Date;
}