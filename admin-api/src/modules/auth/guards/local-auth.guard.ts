/**
 * Local Authentication Guard
 * 
 * Guard that validates username and password credentials.
 * Used for login endpoints and credential validation.
 * 
 * @guard LocalAuthGuard
 * @example
 * ```typescript
 * @UseGuards(LocalAuthGuard)
 * @Post('login')
 * async login(@Request() req) {
 *   // req.user contains validated user data
 *   return { message: `Welcome ${req.user.username}` };
 * }
 * ```
 */
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {}
