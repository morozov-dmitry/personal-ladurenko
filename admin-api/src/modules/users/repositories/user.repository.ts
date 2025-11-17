import { Injectable } from '@nestjs/common';
import { InjectModel, Model } from 'nestjs-dynamoose';
import * as bcrypt from 'bcryptjs';
import { User } from '../entities/user.entity';
import { DynamoDBService } from '../../../services/dynamodb.service';

// Export the User type for use in services
export type UserDocument = User;

/**
 * Repository for user data operations
 *
 * Provides data access methods for user management including CRUD operations,
 * user lookup by various criteria, and user existence checks. Uses DynamoDB
 * as the underlying storage with Dynamoose ORM for simplified data access.
 *
 * @class UserRepository
 * @example
 * ```typescript
 * // Create a new user
 * const user = await userRepository.create({
 *   username: "john_doe",
 *   email: "john@example.com",
 *   firstName: "John",
 *   lastName: "Doe"
 * });
 * ```
 */
@Injectable()
export class UserRepository {
  /**
   * Creates an instance of UserRepository
   *
   * @param {Model<User>} userModel - Injected User model from nestjs-dynamoose
   * @param {DynamoDBService} dynamoDBService - Service for DynamoDB operations
   */
  constructor(
    @InjectModel('User')
    private readonly userModel: Model<User, any>,
    private readonly dynamoDBService: DynamoDBService,
  ) {}

  /**
   * Gets the table name for users with environment prefix
   *
   * @returns {string} The full table name including environment prefix
   * @private
   */
  private getTableName(): string {
    return this.dynamoDBService.getTableName('users');
  }

  /**
   * Creates a new user in the database with password encryption
   *
   * @param {Partial<User>} data - User data to create
   * @returns {Promise<any>} The created user document
   * @example
   * ```typescript
   * const user = await userRepository.create({
   *   username: "john_doe",
   *   password: "plaintext_password", // Will be hashed
   *   email: "john@example.com",
   *   firstName: "John",
   *   lastName: "Doe"
   * });
   * ```
   */
  async create(data: any): Promise<any> {
    // Hash password if provided
    const userData = { ...data };
    if (userData.password) {
      userData.password = await bcrypt.hash(userData.password, 10);
    }
    
    return this.userModel.create(userData);
  }

  /**
   * Finds a user by their unique identifier
   *
   * @param {string} id - The user's unique identifier
   * @returns {Promise<any>} The user document or null if not found
   * @example
   * ```typescript
   * const user = await userRepository.findById("123e4567-e89b-12d3-a456-426614174000");
   * ```
   */
  async findById(id: string): Promise<any> {
    return this.userModel.get(id);
  }

  /**
   * Retrieves all users from the database
   *
   * @returns {Promise<any[]>} Array of all user documents
   * @example
   * ```typescript
   * const users = await userRepository.findAll();
   * console.log(`Found ${users.length} users`);
   * ```
   */
  async findAll(): Promise<any[]> {
    return this.userModel.scan().exec();
  }

  /**
   * Finds a user by their username
   *
   * @param {string} username - The username to search for
   * @returns {Promise<any>} The user document or null if not found
   * @example
   * ```typescript
   * const user = await userRepository.findByUsername("john_doe");
   * ```
   */
  async findByUsername(username: string): Promise<any> {
    return this.userModel
      .query('username')
      .eq(username)
      .using('username-index')
      .exec()
      .then((users) => users[0] || null);
  }

  /**
   * Finds a user by their email address
   *
   * @param {string} email - The email address to search for
   * @returns {Promise<any>} The user document or null if not found
   * @example
   * ```typescript
   * const user = await userRepository.findByEmail("john@example.com");
   * ```
   */
  async findByEmail(email: string): Promise<any> {
    return this.userModel
      .query('email')
      .eq(email)
      .using('email-index')
      .exec()
      .then((users) => users[0] || null);
  }

  /**
   * Finds users by their status
   *
   * @param {number} status - The status value to filter by
   * @returns {Promise<any[]>} Array of user documents with the specified status
   * @example
   * ```typescript
   * const activeUsers = await userRepository.findByStatus(1);
   * ```
   */
  async findByStatus(status: number): Promise<any[]> {
    return this.userModel.scan('status').eq(status).exec();
  }

  /**
   * Finds users by their role
   *
   * @param {string} role - The role to filter by
   * @returns {Promise<any[]>} Array of user documents with the specified role
   * @example
   * ```typescript
   * const adminUsers = await userRepository.findByRole("admin");
   * ```
   */
  async findByRole(role: string): Promise<any[]> {
    return this.userModel.scan('role').eq(role).exec();
  }

  /**
   * Updates an existing user with password encryption
   *
   * @param {string} id - The user's unique identifier
   * @param {Partial<User>} data - The data to update
   * @returns {Promise<any>} The updated user document
   * @example
   * ```typescript
   * const updatedUser = await userRepository.update("123e4567-e89b-12d3-a456-426614174000", {
   *   firstName: "John",
   *   lastName: "Smith",
   *   password: "new_password" // Will be hashed
   * });
   * ```
   */
  async update(id: string, data: Partial<User>): Promise<any> {
    // Hash password if provided in update
    const updateData = { ...data };
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }
    
    return this.userModel.update({ id }, updateData);
  }

  /**
   * Deletes a user by their unique identifier
   *
   * @param {string} id - The user's unique identifier
   * @returns {Promise<void>} No return value
   * @example
   * ```typescript
   * await userRepository.delete("123e4567-e89b-12d3-a456-426614174000");
   * ```
   */
  async delete(id: string): Promise<void> {
    return this.userModel.delete(id);
  }

  /**
   * Counts the total number of users
   *
   * @returns {Promise<number>} The total count of users
   * @example
   * ```typescript
   * const userCount = await userRepository.count();
   * console.log(`Total users: ${userCount}`);
   * ```
   */
  async count(): Promise<number> {
    const result = await this.userModel.scan().count().exec();
    return result.count;
  }

  /**
   * Checks if a user exists with the given username
   *
   * @param {string} username - The username to check
   * @returns {Promise<boolean>} True if user exists, false otherwise
   * @example
   * ```typescript
   * const exists = await userRepository.existsByUsername("john_doe");
   * if (exists) {
   *   console.log("Username is already taken");
   * }
   * ```
   */
  async existsByUsername(username: string): Promise<boolean> {
    const user = await this.findByUsername(username);
    return user !== null;
  }

  /**
   * Checks if a user exists with the given email
   *
   * @param {string} email - The email to check
   * @returns {Promise<boolean>} True if user exists, false otherwise
   * @example
   * ```typescript
   * const exists = await userRepository.existsByEmail("john@example.com");
   * if (exists) {
   *   console.log("Email is already registered");
   * }
   * ```
   */
  async existsByEmail(email: string): Promise<boolean> {
    const user = await this.findByEmail(email);
    return user !== null;
  }

  /**
   * Validates a user's password
   *
   * @param {string} id - The user's unique identifier
   * @param {string} password - Plain text password to validate
   * @returns {Promise<boolean>} True if password matches
   * @example
   * ```typescript
   * const isValid = await userRepository.validatePassword("user-id", "password123");
   * ```
   */
  async validatePassword(id: string, password: string): Promise<boolean> {
    const user = await this.findById(id);
    if (!user || !user.password) {
      return false;
    }
    
    return await bcrypt.compare(password, user.password);
  }

  /**
   * Changes a user's password
   *
   * @param {string} id - The user's unique identifier
   * @param {string} newPassword - New plain text password
   * @returns {Promise<boolean>} True if password was changed successfully
   * @example
   * ```typescript
   * const success = await userRepository.changePassword("user-id", "new_password");
   * ```
   */
  async changePassword(id: string, newPassword: string): Promise<boolean> {
    try {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await this.update(id, { password: hashedPassword });
      return true;
    } catch (error) {
      console.error('Error changing password:', error);
      return false;
    }
  }

  /**
   * Gets user data without password field
   *
   * @param {any} user - User object
   * @returns User object without password
   * @example
   * ```typescript
   * const safeUser = userRepository.getSafeUserData(user);
   * ```
   */
  getSafeUserData(user: any): any {
    if (!user) return null;
    const { password, ...safeUser } = user;
    return safeUser;
  }
}
