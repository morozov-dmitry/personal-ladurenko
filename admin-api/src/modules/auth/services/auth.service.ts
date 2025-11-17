/**
 * Authentication Service
 * 
 * Core service handling all authentication logic including user validation,
 * login, registration, and JWT token management. Integrates with UsersService
 * for user data operations and uses bcrypt for password hashing.
 * 
 * @service AuthService
 * @example
 * ```typescript
 * // Inject the service
 * constructor(private authService: AuthService) {}
 * 
 * // Login a user
 * const result = await this.authService.login({
 *   username: 'john_doe',
 *   password: 'password123'
 * });
 * ```
 */
import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../../users/users.service';
import { LoginDto } from '../dto/login.dto';
import { RegisterDto } from '../dto/register.dto';
import { AuthResponseDto } from '../dto/auth-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  /**
   * Validate User Credentials
   * 
   * Validates username and password against stored user data.
   * Used by LocalStrategy for authentication.
   * 
   * @param username - User's username
   * @param password - User's plain text password
   * @returns Promise<any> - User data without password, or null if invalid
   * @example
   * ```typescript
   * const user = await this.validateUser('john_doe', 'password123');
   * if (user) {
   *   // User is valid
   * }
   * ```
   */
  async validateUser(username: string, password: string): Promise<any> {
    // Find user by username
    const user = await this.usersService.findByUsername(username);

    // Check if user exists and password matches
    if (user && await bcrypt.compare(password, user.password)) {
      // Remove password from returned user object
      const { password: _, ...result } = user;
      return result;
    }
    
    // Return null if credentials are invalid
    return null;
  }

  /**
   * User Login
   * 
   * Authenticates user credentials and returns JWT token with user data.
   * 
   * @param loginDto - Login credentials (username and password)
   * @returns Promise<AuthResponseDto> - JWT token and user information
   * @throws UnauthorizedException - If credentials are invalid
   * @example
   * ```typescript
   * const authResult = await this.login({
   *   username: 'john_doe',
   *   password: 'password123'
   * });
   * // Returns: { access_token: 'jwt_token', user: {...} }
   * ```
   */
  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    // Validate user credentials
    const user = await this.validateUser(loginDto.username, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Create JWT payload with user information
    const payload = { username: user.username, sub: user.id };
    
    // Generate JWT token
    const access_token = this.jwtService.sign(payload);

    // Return token and user data
    return {
      access_token,
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        email: user.email,
        status: user.status,
      },
    };
  }

  /**
   * User Registration
   * 
   * Creates a new user account with validation for username and email uniqueness.
   * Automatically hashes password and sets user status to active.
   * 
   * @param registerDto - User registration data
   * @returns Promise<AuthResponseDto> - JWT token and user information
   * @throws ConflictException - If username or email already exists
   * @example
   * ```typescript
   * const authResult = await this.register({
   *   username: 'john_doe',
   *   password: 'password123',
   *   name: 'John Doe',
   *   town: 'Kyiv',
   *   address: '123 Main Street',
   *   phone: '+380961234567'
   * });
   * ```
   */
  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
    // Check if username already exists
    const existingUser = await this.usersService.findByUsername(registerDto.username);
    if (existingUser) {
      throw new ConflictException('Username already exists');
    }

    // Check if email already exists (if provided)
    if (registerDto.email) {
      const existingEmail = await this.usersService.findByEmail(registerDto.email);
      if (existingEmail) {
        throw new ConflictException('Email already exists');
      }
    }

    // Hash password with salt rounds of 10
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    // Prepare user data for creation
    const userData = {
      ...registerDto,
      password: hashedPassword,
      status: 1, // Set user as active by default
    };

    // Create new user
    const user = await this.usersService.create(userData);

    // Generate JWT token for immediate login
    const payload = { username: user.username, sub: user.id };
    const access_token = this.jwtService.sign(payload);

    // Return token and user data
    return {
      access_token,
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        email: user.email,
        status: user.status,
      },
    };
  }

  /**
   * Get User Profile
   * 
   * Retrieves user profile information by ID, excluding sensitive data like password.
   * 
   * @param userId - User's unique identifier
   * @returns Promise<any> - User profile data without password
   * @throws UnauthorizedException - If user is not found
   * @example
   * ```typescript
   * const profile = await this.getProfile('user-id-123');
   * // Returns user data without password field
   * ```
   */
  async getProfile(userId: string): Promise<any> {
    // Find user by ID
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Remove password from returned user object
    const { password: _, ...result } = user;
    return result;
  }
}
