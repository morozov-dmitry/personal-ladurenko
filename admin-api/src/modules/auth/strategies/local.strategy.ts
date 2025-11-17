/**
 * Local Strategy
 * 
 * Passport strategy for validating username and password credentials.
 * Used for login and credential validation endpoints.
 * 
 * @strategy LocalStrategy
 * @example
 * ```typescript
 * // Use with LocalAuthGuard
 * @UseGuards(LocalAuthGuard)
 * @Post('login')
 * async login(@Request() req) {
 *   // req.user contains validated user data
 * }
 * ```
 */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../services/auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      // Map request body fields to username and password
      usernameField: 'username',
      passwordField: 'password',
    });
  }

  /**
   * Validate User Credentials
   * 
   * Called by Passport to validate username and password.
   * Delegates to AuthService for actual validation logic.
   * 
   * @param username - User's username from request body
   * @param password - User's password from request body
   * @returns Promise<any> - User data if validation succeeds
   * @throws UnauthorizedException - If credentials are invalid
   * @example
   * ```typescript
   * // Request body:
   * // { "username": "john_doe", "password": "password123" }
   * ```
   */
  async validate(username: string, password: string): Promise<any> {
    // Validate credentials using AuthService
    const user = await this.authService.validateUser(username, password);
    
    // Throw exception if credentials are invalid
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    
    // Return user data to be attached to request object
    return user;
  }
}
