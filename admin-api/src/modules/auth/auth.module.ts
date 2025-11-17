/**
 * Authentication Module
 * 
 * This module provides JWT-based authentication using Passport.js strategies.
 * It handles user registration, login, and JWT token management.
 * 
 * @module AuthModule
 * @example
 * ```typescript
 * // Import the module in your app.module.ts
 * import { AuthModule } from './modules/auth/auth.module';
 * 
 * @Module({
 *   imports: [AuthModule],
 * })
 * export class AppModule {}
 * ```
 */
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { UsersModule } from '../users/users.module';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key',
      signOptions: { expiresIn: '24h' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    LocalStrategy,
  ],
  exports: [AuthService],
})
export class AuthModule {}
