/**
 * JWT Strategy
 * 
 * Passport strategy for validating JWT tokens. Extracts JWT from Authorization header
 * and validates the token signature and expiration. Returns user data if token is valid.
 * 
 * @strategy JwtStrategy
 * @example
 * ```typescript
 * // Use with JwtAuthGuard
 * @UseGuards(JwtAuthGuard)
 * @Get('protected-route')
 * async protectedRoute(@Request() req) {
 *   // req.user contains validated user data
 * }
 * ```
 */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private usersService: UsersService) {
    super({
      // Extract JWT token from Authorization header as Bearer token
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      
      // Don't ignore token expiration
      ignoreExpiration: false,
      
      // Use JWT secret from environment or fallback
      secretOrKey: process.env.JWT_SECRET || 'your-secret-key',
    });
  }

  /**
   * Validate JWT Payload
   * 
   * Called by Passport after JWT token is successfully decoded.
   * Validates that the user still exists in the database.
   * 
   * @param payload - Decoded JWT payload containing user information
   * @returns Promise<any> - User data if validation succeeds
   * @throws UnauthorizedException - If user is not found
   * @example
   * ```typescript
   * // JWT payload example:
   * // { username: 'john_doe', sub: 'user-id-123', iat: 1234567890, exp: 1234567890 }
   * ```
   */
  async validate(payload: any) {
    // Extract user ID from JWT payload (sub = subject)
    const user = await this.usersService.findById(payload.sub);
    
    // Throw exception if user no longer exists
    if (!user) {
      throw new UnauthorizedException();
    }
    
    // Return user data to be attached to request object
    return user;
  }
}
