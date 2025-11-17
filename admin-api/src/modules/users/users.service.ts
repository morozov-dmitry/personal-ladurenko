import { Injectable } from '@nestjs/common';
import { InjectModel, Model } from 'nestjs-dynamoose';
import * as bcrypt from 'bcryptjs';
import { User, UserSchema } from './entities/user.entity';
import { CreateUserDto } from './dto/user.dto';
import { UpdateUserDto } from './dto/user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('User')
    private userModel: Model<User, string>,
  ) {}

  /**
   * Creates a new user with password encryption
   * 
   * @param createUserDto - User data including password
   * @returns Promise<User> - Created user without password
   * @example
   * ```typescript
   * const user = await usersService.create({
   *   username: 'john_doe',
   *   password: 'plaintext_password',
   *   name: 'John Doe',
   *   email: 'john@example.com'
   * });
   * ```
   */
  async create(createUserDto: CreateUserDto): Promise<User> {
    // Hash password if provided
    const userData = { ...createUserDto };
    if (userData.password) {
      userData.password = await bcrypt.hash(userData.password, 10);
    }
    
    const user = await this.userModel.create(userData as any);
    return user as User;
  }

  async findAll(): Promise<User[]> {
    const users = await this.userModel.scan().exec();
    return users as User[];
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.userModel.get(id);
    return user as User | null;
  }

  async findByUsername(username: string): Promise<User | null> {
    const users = await this.userModel.query('username').eq(username).exec();
    return users.length > 0 ? (users[0] as User) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const users = await this.userModel.query('email').eq(email).exec();
    return users.length > 0 ? (users[0] as User) : null;
  }

  /**
   * Updates a user with optional password encryption
   * 
   * @param id - User ID
   * @param updateUserDto - User data including optional password
   * @returns Promise<User | null> - Updated user without password
   * @example
   * ```typescript
   * const user = await usersService.update('user-id', {
   *   name: 'John Updated',
   *   password: 'new_password' // Will be hashed
   * });
   * ```
   */
  async update(id: string, updateUserDto: UpdateUserDto): Promise<User | null> {
    // Hash password if provided in update
    const updateData = { ...updateUserDto };
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }
    
    const user = await this.userModel.update(id, updateData as any);
    return user as User | null;
  }

  async remove(id: string): Promise<void> {
    await this.userModel.delete(id);
  }

  /**
   * Validates a user's password
   * 
   * @param userId - User ID
   * @param password - Plain text password to validate
   * @returns Promise<boolean> - True if password matches
   * @example
   * ```typescript
   * const isValid = await usersService.validatePassword('user-id', 'password123');
   * ```
   */
  async validatePassword(userId: string, password: string): Promise<boolean> {
    const user = await this.findById(userId);
    if (!user || !user.password) {
      return false;
    }
    
    return await bcrypt.compare(password, user.password);
  }

  /**
   * Changes a user's password
   * 
   * @param userId - User ID
   * @param newPassword - New plain text password
   * @returns Promise<boolean> - True if password was changed successfully
   * @example
   * ```typescript
   * const success = await usersService.changePassword('user-id', 'new_password');
   * ```
   */
  async changePassword(userId: string, newPassword: string): Promise<boolean> {
    try {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await this.userModel.update(userId, { password: hashedPassword } as any);
      return true;
    } catch (error) {
      console.error('Error changing password:', error);
      return false;
    }
  }

  /**
   * Gets user data without password field
   * 
   * @param user - User object
   * @returns User object without password
   * @example
   * ```typescript
   * const safeUser = usersService.getSafeUserData(user);
   * ```
   */
  getSafeUserData(user: User): Omit<User, 'password'> {
    const { password, ...safeUser } = user;
    return safeUser;
  }

  async findAllPaginated(page: number = 1, limit: number = 10, filters: any = {}) {
    const offset = (page - 1) * limit;
    
    let query = this.userModel.scan();
    
    // Apply filters
    if (filters.status !== undefined) {
      query = query.where('status').eq(filters.status);
    }
    
    if (filters.username) {
      query = query.where('username').contains(filters.username);
    }
    
    if (filters.email) {
      query = query.where('email').contains(filters.email);
    }
    
    if (filters.town) {
      query = query.where('town').contains(filters.town);
    }

    const results = await query.exec();
    const total = results.length;
    const items = results.slice(offset, offset + limit);

    return {
      items: items as User[],
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}
