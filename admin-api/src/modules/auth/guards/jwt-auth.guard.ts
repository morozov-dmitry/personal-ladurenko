/**
 * JWT Authentication Guard
 * 
 * Guard that protects routes requiring JWT authentication.
 * Validates JWT tokens from Authorization header and attaches user data to request.
 * 
 * @guard JwtAuthGuard
 * @example
 * ```typescript
 * @UseGuards(JwtAuthGuard)
 * @Get('protected-route')
 * async protectedRoute(@Request() req) {
 *   // req.user contains authenticated user data
 *   return { message: `Hello ${req.user.username}` };
 * }
 * ```
 */
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
