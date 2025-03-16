import { UserRole } from '@app/core/models/User.model';
import { FORM_CONSTANTS } from '@app/core/constants/forms';
import axios from 'axios';
import { API_ROUTES } from '@app/core/constants/api';
import { PACKAGE_TYPES } from '@app/core/constants/package';

export class FormFieldValidator {
  static validateName(value: string): boolean {
    const nameRegex = FORM_CONSTANTS.REGEX.LETTERS;
    return nameRegex.test(value);
  }

  static validateEmail(value: string): boolean {
    const emailRegex = FORM_CONSTANTS.REGEX.EMAIL;
    return emailRegex.test(value);
  }

  static validatePassword(value: string): boolean {
    const passwordRegex = FORM_CONSTANTS.REGEX.PASSWORD;
    return passwordRegex.test(value);
  }

  static validateRole(value: string): boolean {
    const validRoles = Object.values(UserRole);
    return validRoles.includes(value as UserRole);
  }

  static validateWeight(value: number): boolean {
    return value > 0 && value <= PACKAGE_TYPES.MAX_WEIGHT;
  }

  static validateLength(value: number): boolean {
    return value > 0 && value <= PACKAGE_TYPES.MAX_LENGTH;
  }

  static validateWidth(value: number): boolean {
    return value > 0 && value <= PACKAGE_TYPES.MAX_WIDTH;
  }

  static validateHeight(value: number): boolean {
    return value > 0 && value <= PACKAGE_TYPES.MAX_HEIGHT;
  }

  static async validateAddress(address: string): Promise<boolean> {
    try {
      const response = await axios.get(API_ROUTES.EXTERNAL.NOMINATIM, {
        params: { q: address, format: 'json' },
      });

      return response.data.length > 0;
    } catch (error) {
      console.error('Error validating address:', error);
      return false;
    }
  }
}
