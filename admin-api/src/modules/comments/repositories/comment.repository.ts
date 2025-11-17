import { Injectable } from '@nestjs/common';
import { InjectModel, Model } from 'nestjs-dynamoose';
import { Comment } from '../entities/comment.entity';
import { DynamoDBService } from '../../../services/dynamodb.service';

// Export the Comment type for use in services
export type CommentDocument = Comment;

/**
 * Repository for comment data operations
 *
 * Provides data access methods for comment management including CRUD operations,
 * comment filtering by various criteria, and statistical operations. Uses DynamoDB
 * as the underlying storage with Dynamoose ORM for simplified data access.
 *
 * @class CommentRepository
 * @example
 * ```typescript
 * // Create a new comment
 * const comment = await commentRepository.create({
 *   contentUk: "Дуже хороший сервіс!",
 *   contentRu: "Очень хороший сервис!",
 *   score: 5,
 *   authorName: "John Doe"
 * });
 * ```
 */
@Injectable()
export class CommentRepository {
  /**
   * Creates an instance of CommentRepository
   *
   * @param {Model<Comment>} commentModel - Injected Comment model from nestjs-dynamoose
   * @param {DynamoDBService} dynamoDBService - Service for DynamoDB operations
   */
  constructor(
    @InjectModel('Comment')
    private readonly commentModel: Model<Comment, any>,
    private readonly dynamoDBService: DynamoDBService,
  ) {}

  /**
   * Gets the table name for comments with environment prefix
   *
   * @returns {string} The full table name including environment prefix
   * @private
   */
  private getTableName(): string {
    return this.dynamoDBService.getTableName('comments');
  }

  /**
   * Creates a new comment in the database
   *
   * @param {Partial<Comment>} data - Comment data to create
   * @returns {Promise<any>} The created comment document
   * @example
   * ```typescript
   * const comment = await commentRepository.create({
   *   contentUk: "Дуже хороший сервіс!",
   *   contentRu: "Очень хороший сервис!",
   *   score: 5,
   *   authorName: "John Doe"
   * });
   * ```
   */
  async create(data: any): Promise<any> {
    return this.commentModel.create(data);
  }

  /**
   * Finds a comment by its unique identifier
   *
   * @param {string} id - The comment's unique identifier
   * @returns {Promise<any>} The comment document or null if not found
   * @example
   * ```typescript
   * const comment = await commentRepository.findById("123e4567-e89b-12d3-a456-426614174000");
   * ```
   */
  async findById(id: string): Promise<any> {
    return this.commentModel.get(id);
  }

  /**
   * Retrieves all comments from the database
   *
   * @returns {Promise<any[]>} Array of all comment documents
   * @example
   * ```typescript
   * const comments = await commentRepository.findAll();
   * console.log(`Found ${comments.length} comments`);
   * ```
   */
  async findAll(): Promise<any[]> {
    return this.commentModel.scan().exec();
  }

  /**
   * Finds comments by their status
   *
   * @param {number} status - The status value to filter by
   * @returns {Promise<any[]>} Array of comment documents with the specified status
   * @example
   * ```typescript
   * const approvedComments = await commentRepository.findByStatus(1);
   * ```
   */
  async findByStatus(status: number): Promise<any[]> {
    return this.commentModel.scan('status').eq(status).exec();
  }

  /**
   * Finds comments with a minimum score
   *
   * @param {number} minScore - The minimum score threshold
   * @returns {Promise<any[]>} Array of comment documents with score >= minScore
   * @example
   * ```typescript
   * const highRatedComments = await commentRepository.findByScore(4);
   * ```
   */
  async findByScore(minScore: number): Promise<any[]> {
    // Simplified implementation - scan all and filter in memory
    const allComments = await this.commentModel.scan().exec();
    return allComments.filter((comment) => comment.score >= minScore);
  }

  /**
   * Finds the most recent comments
   *
   * @param {number} limit - Maximum number of comments to return (default: 10)
   * @returns {Promise<any[]>} Array of recent comment documents
   * @example
   * ```typescript
   * const recentComments = await commentRepository.findRecent(5);
   * ```
   */
  async findRecent(limit: number = 10): Promise<any[]> {
    return this.commentModel
      .query('createdAt')
      .using('createdAt-index')
      .sort('descending' as any)
      .limit(limit)
      .exec();
  }

  /**
   * Finds comments within a score range
   *
   * @param {number} minScore - The minimum score (inclusive)
   * @param {number} maxScore - The maximum score (inclusive)
   * @returns {Promise<any[]>} Array of comment documents within the score range
   * @example
   * ```typescript
   * const mediumRatedComments = await commentRepository.findByScoreRange(3, 4);
   * ```
   */
  async findByScoreRange(minScore: number, maxScore: number): Promise<any[]> {
    return this.commentModel.scan('score').between(minScore, maxScore).exec();
  }

  /**
   * Updates an existing comment
   *
   * @param {string} id - The comment's unique identifier
   * @param {Partial<Comment>} data - The data to update
   * @returns {Promise<any>} The updated comment document
   * @example
   * ```typescript
   * const updatedComment = await commentRepository.update("123e4567-e89b-12d3-a456-426614174000", {
   *   score: 4,
   *   status: 1
   * });
   * ```
   */
  async update(id: string, data: Partial<Comment>): Promise<any> {
    return this.commentModel.update({ id }, data);
  }

  /**
   * Deletes a comment by its unique identifier
   *
   * @param {string} id - The comment's unique identifier
   * @returns {Promise<void>} No return value
   * @example
   * ```typescript
   * await commentRepository.delete("123e4567-e89b-12d3-a456-426614174000");
   * ```
   */
  async delete(id: string): Promise<void> {
    return this.commentModel.delete(id);
  }

  /**
   * Counts the total number of comments
   *
   * @returns {Promise<number>} The total count of comments
   * @example
   * ```typescript
   * const commentCount = await commentRepository.count();
   * console.log(`Total comments: ${commentCount}`);
   * ```
   */
  async count(): Promise<number> {
    const result = await this.commentModel.scan().count().exec();
    return result.count;
  }

  /**
   * Counts comments by their status
   *
   * @param {number} status - The status value to count
   * @returns {Promise<number>} The count of comments with the specified status
   * @example
   * ```typescript
   * const approvedCount = await commentRepository.countByStatus(1);
   * console.log(`Approved comments: ${approvedCount}`);
   * ```
   */
  async countByStatus(status: number): Promise<number> {
    const result = await this.commentModel
      .scan('status')
      .eq(status)
      .count()
      .exec();
    return result.count;
  }

  /**
   * Calculates the average score of all comments
   *
   * @returns {Promise<number>} The average score of all comments
   * @example
   * ```typescript
   * const averageScore = await commentRepository.getAverageScore();
   * console.log(`Average rating: ${averageScore.toFixed(2)}`);
   * ```
   */
  async getAverageScore(): Promise<number> {
    const comments = await this.findAll();
    if (comments.length === 0) return 0;

    const totalScore = comments.reduce(
      (sum, comment) => sum + comment.score,
      0,
    );
    return totalScore / comments.length;
  }
}
