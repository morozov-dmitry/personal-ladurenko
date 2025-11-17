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
import { UserRepository } from '../repositories/user.repository';
import { CreateUserDto, UpdateUserDto, UserResponseDto } from '../dto/user.dto';

/**
 * Controller for managing user operations
 * 
 * Provides CRUD operations for user management including creation, retrieval,
 * updating, and deletion of user accounts. All endpoints are prefixed with
 * '/api/users' and include comprehensive API documentation.
 * 
 * @class UsersController
 * @example
 * ```typescript
 * // Create a new user
 * POST /api/users
 * {
 *   "username": "john_doe",
 *   "email": "john@example.com",
 *   "firstName": "John",
 *   "lastName": "Doe"
 * }
 * ```
 */
@ApiTags('users')
@Controller('users')
export class UsersController {
  /**
   * Creates an instance of UsersController
   * 
   * @param {UserRepository} userRepository - Repository for user data operations
   */
  constructor(private readonly userRepository: UserRepository) {}

  /**
   * Creates a new user account
   * 
   * Validates the provided user data and creates a new user account in the system.
   * The user data is validated according to the CreateUserDto schema before creation.
   * 
   * @param {CreateUserDto} createUserDto - User data for account creation
   * @returns {Promise<UserResponseDto>} The created user information
   * @throws {BadRequestException} When validation fails
   * @example
   * ```typescript
   * const newUser = await usersController.create({
   *   username: "john_doe",
   *   email: "john@example.com",
   *   firstName: "John",
   *   lastName: "Doe"
   * });
   * ```
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ 
    summary: 'Create a new user',
    description: 'Creates a new user account with personal information'
  })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ 
    status: 201, 
    description: 'User created successfully',
    type: UserResponseDto
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Bad request - validation failed'
  })
  async create(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    return await this.userRepository.create(createUserDto);
  }

  /**
   * Retrieves all users from the database
   * 
   * Fetches a complete list of all user accounts in the system. This operation
   * returns all users regardless of their status or role.
   * 
   * @returns {Promise<UserResponseDto[]>} Array of all users
   * @example
   * ```typescript
   * const allUsers = await usersController.findAll();
   * console.log(`Found ${allUsers.length} users`);
   * ```
   */
  @Get()
  @ApiOperation({ 
    summary: 'Get all users',
    description: 'Retrieves all users from the database'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Users retrieved successfully',
    type: [UserResponseDto]
  })
  async findAll(): Promise<UserResponseDto[]> {
    return await this.userRepository.findAll();
  }

  /**
   * Retrieves a specific user by their unique identifier
   * 
   * Searches for a user with the provided ID and returns their information.
   * If no user is found with the given ID, a NotFoundException is thrown.
   * 
   * @param {string} id - The unique identifier of the user
   * @returns {Promise<UserResponseDto>} The user information
   * @throws {NotFoundException} When user with the given ID is not found
   * @example
   * ```typescript
   * const user = await usersController.findOne("123e4567-e89b-12d3-a456-426614174000");
   * console.log(`Found user: ${user.username}`);
   * ```
   */
  @Get(':id')
  @ApiOperation({ 
    summary: 'Get user by ID',
    description: 'Retrieves a specific user by their unique identifier'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'User unique identifier',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'User found successfully',
    type: UserResponseDto
  })
  @ApiResponse({ 
    status: 404, 
    description: 'User not found'
  })
  async findOne(@Param('id') id: string): Promise<UserResponseDto> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  /**
   * Updates an existing user with new information
   * 
   * Modifies the user data for the specified user ID. Only the fields provided
   * in the updateUserDto will be updated, leaving other fields unchanged.
   * 
   * @param {string} id - The unique identifier of the user to update
   * @param {UpdateUserDto} updateUserDto - The updated user data
   * @returns {Promise<UserResponseDto>} The updated user information
   * @throws {NotFoundException} When user with the given ID is not found
   * @throws {BadRequestException} When validation fails
   * @example
   * ```typescript
   * const updatedUser = await usersController.update("123e4567-e89b-12d3-a456-426614174000", {
   *   firstName: "John",
   *   lastName: "Smith"
   * });
   * ```
   */
  @Patch(':id')
  @ApiOperation({ 
    summary: 'Update user',
    description: 'Updates an existing user with new information'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'User unique identifier',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({ 
    status: 200, 
    description: 'User updated successfully',
    type: UserResponseDto
  })
  @ApiResponse({ 
    status: 404, 
    description: 'User not found'
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Bad request - validation failed'
  })
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    return await this.userRepository.update(id, updateUserDto);
  }

  /**
   * Deletes a user by their unique identifier
   * 
   * Permanently removes a user account from the system. This operation cannot
   * be undone and will delete all associated user data.
   * 
   * @param {string} id - The unique identifier of the user to delete
   * @returns {Promise<void>} No return value
   * @throws {NotFoundException} When user with the given ID is not found
   * @example
   * ```typescript
   * await usersController.remove("123e4567-e89b-12d3-a456-426614174000");
   * console.log("User deleted successfully");
   * ```
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ 
    summary: 'Delete user',
    description: 'Deletes a user by their unique identifier'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'User unique identifier',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @ApiResponse({ 
    status: 204, 
    description: 'User deleted successfully'
  })
  @ApiResponse({ 
    status: 404, 
    description: 'User not found'
  })
  async remove(@Param('id') id: string): Promise<void> {
    await this.userRepository.delete(id);
  }
}