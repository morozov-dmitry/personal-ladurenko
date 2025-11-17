/**
 * Password Utility Service
 * 
 * Provides password-related utilities including validation, strength checking,
 * and secure password generation. Used across the application for consistent
 * password handling and security.
 * 
 * @service PasswordService
 * @example
 * ```typescript
 * // Inject the service
 * constructor(private passwordService: PasswordService) {}
 * 
 * // Check password strength
 * const strength = this.passwordService.checkStrength('password123');
 * ```
 */
import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class PasswordService {
  /**
   * Default salt rounds for password hashing
   */
  private readonly SALT_ROUNDS = 10;

  /**
   * Minimum password length requirement
   */
  private readonly MIN_LENGTH = 8;

  /**
   * Hash a password using bcrypt
   * 
   * @param password - Plain text password
   * @returns Promise<string> - Hashed password
   * @example
   * ```typescript
   * const hashedPassword = await this.passwordService.hash('password123');
   * ```
   */
  async hash(password: string): Promise<string> {
    return await bcrypt.hash(password, this.SALT_ROUNDS);
  }

  /**
   * Compare a plain text password with a hashed password
   * 
   * @param password - Plain text password
   * @param hashedPassword - Hashed password to compare against
   * @returns Promise<boolean> - True if passwords match
   * @example
   * ```typescript
   * const isValid = await this.passwordService.compare('password123', hashedPassword);
   * ```
   */
  async compare(password: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }

  /**
   * Validate password strength
   * 
   * @param password - Password to validate
   * @returns Object with validation results
   * @example
   * ```typescript
   * const validation = this.passwordService.validateStrength('password123');
   * if (!validation.isValid) {
   *   console.log('Password requirements:', validation.requirements);
   * }
   * ```
   */
  validateStrength(password: string): {
    isValid: boolean;
    score: number;
    requirements: string[];
    suggestions: string[];
  } {
    const requirements: string[] = [];
    const suggestions: string[] = [];
    let score = 0;

    // Length check
    if (password.length < this.MIN_LENGTH) {
      requirements.push(`Password must be at least ${this.MIN_LENGTH} characters long`);
    } else {
      score += 1;
    }

    // Uppercase check
    if (!/[A-Z]/.test(password)) {
      requirements.push('Password must contain at least one uppercase letter');
    } else {
      score += 1;
    }

    // Lowercase check
    if (!/[a-z]/.test(password)) {
      requirements.push('Password must contain at least one lowercase letter');
    } else {
      score += 1;
    }

    // Number check
    if (!/\d/.test(password)) {
      requirements.push('Password must contain at least one number');
    } else {
      score += 1;
    }

    // Special character check
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      requirements.push('Password must contain at least one special character');
    } else {
      score += 1;
    }

    // Additional suggestions
    if (password.length < 12) {
      suggestions.push('Consider using a password longer than 12 characters');
    }

    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{12,}/.test(password)) {
      suggestions.push('Use a combination of letters, numbers, and special characters');
    }

    return {
      isValid: requirements.length === 0,
      score,
      requirements,
      suggestions,
    };
  }

  /**
   * Generate a secure random password
   * 
   * @param length - Length of password to generate (default: 16)
   * @param includeSpecialChars - Whether to include special characters (default: true)
   * @returns Generated password
   * @example
   * ```typescript
   * const password = this.passwordService.generateSecurePassword(16);
   * ```
   */
  generateSecurePassword(length: number = 16, includeSpecialChars: boolean = true): string {
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const specialChars = '!@#$%^&*(),.?":{}|<>';

    let charset = lowercase + uppercase + numbers;
    if (includeSpecialChars) {
      charset += specialChars;
    }

    let password = '';
    
    // Ensure at least one character from each required category
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    
    if (includeSpecialChars) {
      password += specialChars[Math.floor(Math.random() * specialChars.length)];
    }

    // Fill the rest randomly
    for (let i = password.length; i < length; i++) {
      password += charset[Math.floor(Math.random() * charset.length)];
    }

    // Shuffle the password
    return password.split('').sort(() => Math.random() - 0.5).join('');
  }

  /**
   * Check if password meets minimum requirements
   * 
   * @param password - Password to check
   * @returns boolean - True if meets minimum requirements
   * @example
   * ```typescript
   * const meetsMinimum = this.passwordService.meetsMinimumRequirements('password123');
   * ```
   */
  meetsMinimumRequirements(password: string): boolean {
    return password.length >= this.MIN_LENGTH;
  }

  /**
   * Get password strength level
   * 
   * @param password - Password to analyze
   * @returns string - Strength level (weak, medium, strong, very-strong)
   * @example
   * ```typescript
   * const strength = this.passwordService.getStrengthLevel('password123');
   * // Returns: 'weak', 'medium', 'strong', or 'very-strong'
   * ```
   */
  getStrengthLevel(password: string): 'weak' | 'medium' | 'strong' | 'very-strong' {
    const validation = this.validateStrength(password);
    
    if (validation.score <= 2) return 'weak';
    if (validation.score === 3) return 'medium';
    if (validation.score === 4) return 'strong';
    return 'very-strong';
  }
}
