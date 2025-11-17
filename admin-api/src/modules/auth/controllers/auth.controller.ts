/**
 * Authentication Controller
 * 
 * Handles all authentication-related HTTP requests including login, registration,
 * profile retrieval, and credential validation. Uses JWT and Local auth guards
 * for route protection and validation.
 * 
 * @controller AuthController
 * @example
 * ```typescript
 * // Login request
 * POST /auth/login
 * {
 *   "username": "john_doe",
 *   "password": "password123"
 * }
 * 
 * // Register request
 * POST /auth/register
 * {
 *   "username": "john_doe",
 *   "password": "password123",
 *   "name": "John Doe",
 *   "town": "Kyiv",
 *   "address": "123 Main Street",
 *   "phone": "+380961234567"
 * }
 * ```
 */
import { Controller, Post, Body, UseGuards, Get, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from '../services/auth.service';
import { LoginDto } from '../dto/login.dto';
import { RegisterDto } from '../dto/register.dto';
import { AuthResponseDto } from '../dto/auth-response.dto';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  /**
   * User Login Endpoint
   * 
   * Authenticates a user with username and password, returns JWT token
   * and user information if credentials are valid.
   * 
   * @param loginDto - Login credentials (username and password)
   * @returns Promise<AuthResponseDto> - JWT token and user data
   * @throws UnauthorizedException - If credentials are invalid
   */
  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid credentials',
  })
  async login(@Body() loginDto: LoginDto): Promise<AuthResponseDto> {
    return this.authService.login(loginDto);
  }

  /**
   * User Registration Endpoint
   * 
   * Creates a new user account with the provided information.
   * Validates username and email uniqueness before creating the account.
   * 
   * @param registerDto - User registration data
   * @returns Promise<AuthResponseDto> - JWT token and user data
   * @throws ConflictException - If username or email already exists
   */
  @Post('register')
  @ApiOperation({ summary: 'User registration' })
  @ApiResponse({
    status: 201,
    description: 'Registration successful',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 409,
    description: 'Username or email already exists',
  })
  async register(@Body() registerDto: RegisterDto): Promise<AuthResponseDto> {
    return this.authService.register(registerDto);
  }

  /**
   * Get User Profile Endpoint
   * 
   * Retrieves the current user's profile information.
   * Requires valid JWT token in Authorization header.
   * 
   * @param req - Express request object with authenticated user
   * @returns Promise<any> - User profile data (password excluded)
   * @throws UnauthorizedException - If JWT token is invalid or missing
   */
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({
    status: 200,
    description: 'User profile retrieved successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async getProfile(@Request() req) {
    return this.authService.getProfile(req.user.id);
  }

  /**
   * Validate Credentials Endpoint
   * 
   * Validates username and password credentials using LocalAuthGuard.
   * Returns user information if credentials are valid.
   * 
   * @param req - Express request object with validated user
   * @returns any - User data (password excluded)
   * @throws UnauthorizedException - If credentials are invalid
   */
  @Post('validate')
  @UseGuards(LocalAuthGuard)
  @ApiOperation({ summary: 'Validate user credentials' })
  @ApiResponse({
    status: 200,
    description: 'Credentials are valid',
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid credentials',
  })
  async validate(@Request() req) {
    return req.user;
  }
}
