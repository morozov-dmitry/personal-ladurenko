import { 
  Controller, 
  Get, 
  Post, 
  Patch, 
  Delete, 
  Body, 
  Param, 
  HttpCode, 
  HttpStatus,
  NotFoundException
} from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiParam, 
  ApiBody 
} from '@nestjs/swagger';
import { CommentRepository } from '../repositories/comment.repository';
import { CommentDocument } from '../repositories/comment.repository';
import { CreateCommentDto, UpdateCommentDto, CommentResponseDto } from '../dto/comment.dto';

/**
 * Controller for managing comment operations
 * 
 * Provides CRUD operations for comment management including creation, retrieval,
 * updating, and deletion of user comments. All endpoints are prefixed with
 * '/api/comments' and include comprehensive API documentation.
 * 
 * @class CommentsController
 * @example
 * ```typescript
 * // Create a new comment
 * POST /api/comments
 * {
 *   "contentUk": "Дуже хороший сервіс!",
 *   "contentRu": "Очень хороший сервис!",
 *   "score": 5,
 *   "authorName": "John Doe"
 * }
 * ```
 */
@ApiTags('comments')
@Controller('comments')
export class CommentsController {
  /**
   * Creates an instance of CommentsController
   * 
   * @param {CommentRepository} commentRepository - Repository for comment data operations
   */
  constructor(private readonly commentRepository: CommentRepository) {}

  /**
   * Creates a new comment with bilingual content
   * 
   * Validates the provided comment data and creates a new comment in the system.
   * The comment data is validated according to the CreateCommentDto schema before creation.
   * 
   * @param {CreateCommentDto} createCommentDto - Comment data for creation
   * @returns {Promise<CommentResponseDto>} The created comment information
   * @throws {BadRequestException} When validation fails
   * @example
   * ```typescript
   * const newComment = await commentsController.create({
   *   contentUk: "Дуже хороший сервіс!",
   *   contentRu: "Очень хороший сервис!",
   *   score: 5,
   *   authorName: "John Doe"
   * });
   * ```
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ 
    summary: 'Create a new comment',
    description: 'Creates a new comment with bilingual content and rating'
  })
  @ApiBody({ type: CreateCommentDto })
  @ApiResponse({ 
    status: 201, 
    description: 'Comment created successfully',
    type: CommentResponseDto
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Bad request - validation failed'
  })
  async create(@Body() createCommentDto: CreateCommentDto): Promise<CommentResponseDto> {
    return await this.commentRepository.create(createCommentDto);
  }

  /**
   * Retrieves all comments from the database
   * 
   * Fetches a complete list of all comments in the system. This operation
   * returns all comments regardless of their status or score.
   * 
   * @returns {Promise<CommentResponseDto[]>} Array of all comments
   * @example
   * ```typescript
   * const allComments = await commentsController.findAll();
   * console.log(`Found ${allComments.length} comments`);
   * ```
   */
  @Get()
  @ApiOperation({ 
    summary: 'Get all comments',
    description: 'Retrieves all comments from the database'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Comments retrieved successfully',
    type: [CommentResponseDto]
  })
  async findAll(): Promise<CommentResponseDto[]> {
    return await this.commentRepository.findAll();
  }

  /**
   * Retrieves a specific comment by its unique identifier
   * 
   * Searches for a comment with the provided ID and returns its information.
   * If no comment is found with the given ID, a NotFoundException is thrown.
   * 
   * @param {string} id - The unique identifier of the comment
   * @returns {Promise<CommentResponseDto>} The comment information
   * @throws {NotFoundException} When comment with the given ID is not found
   * @example
   * ```typescript
   * const comment = await commentsController.findOne("123e4567-e89b-12d3-a456-426614174000");
   * console.log(`Found comment: ${comment.contentUk}`);
   * ```
   */
  @Get(':id')
  @ApiOperation({ 
    summary: 'Get comment by ID',
    description: 'Retrieves a specific comment by its unique identifier'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'Comment unique identifier',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Comment found successfully',
    type: CommentResponseDto
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Comment not found'
  })
  async findOne(@Param('id') id: string): Promise<CommentResponseDto> {
    const comment = await this.commentRepository.findById(id);
    if (!comment) {
      throw new NotFoundException(`Comment with ID ${id} not found`);
    }
    return comment;
  }

  /**
   * Updates an existing comment with new information
   * 
   * Modifies the comment data for the specified comment ID. Only the fields provided
   * in the updateCommentDto will be updated, leaving other fields unchanged.
   * 
   * @param {string} id - The unique identifier of the comment to update
   * @param {UpdateCommentDto} updateCommentDto - The updated comment data
   * @returns {Promise<CommentResponseDto>} The updated comment information
   * @throws {NotFoundException} When comment with the given ID is not found
   * @throws {BadRequestException} When validation fails
   * @example
   * ```typescript
   * const updatedComment = await commentsController.update("123e4567-e89b-12d3-a456-426614174000", {
   *   score: 4,
   *   status: 1
   * });
   * ```
   */
  @Patch(':id')
  @ApiOperation({ 
    summary: 'Update comment',
    description: 'Updates an existing comment with new information'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'Comment unique identifier',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @ApiBody({ type: UpdateCommentDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Comment updated successfully',
    type: CommentResponseDto
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Comment not found'
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Bad request - validation failed'
  })
  async update(
    @Param('id') id: string,
    @Body() updateCommentDto: UpdateCommentDto,
  ): Promise<CommentResponseDto> {
    return await this.commentRepository.update(id, updateCommentDto);
  }

  /**
   * Deletes a comment by its unique identifier
   * 
   * Permanently removes a comment from the system. This operation cannot
   * be undone and will delete all associated comment data.
   * 
   * @param {string} id - The unique identifier of the comment to delete
   * @returns {Promise<void>} No return value
   * @throws {NotFoundException} When comment with the given ID is not found
   * @example
   * ```typescript
   * await commentsController.remove("123e4567-e89b-12d3-a456-426614174000");
   * console.log("Comment deleted successfully");
   * ```
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ 
    summary: 'Delete comment',
    description: 'Deletes a comment by its unique identifier'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'Comment unique identifier',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @ApiResponse({ 
    status: 204, 
    description: 'Comment deleted successfully'
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Comment not found'
  })
  async remove(@Param('id') id: string): Promise<void> {
    await this.commentRepository.delete(id);
  }
}