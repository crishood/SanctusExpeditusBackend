import { UserRole } from '@app/core/models/User.model';
import { FORM_CONSTANTS } from '@app/core/constants/forms';
import axios from 'axios';
import { API_ROUTES } from '@app/core/constants/api';
export const validations = {
  name: (value: string): boolean => {
    const nameRegex = FORM_CONSTANTS.REGEX.LETTERS;
    return nameRegex.test(value);
  },

  email: (value: string): boolean => {
    const emailRegex = FORM_CONSTANTS.REGEX.EMAIL;
    return emailRegex.test(value);
  },

  password: (value: string): boolean => {
    const passwordRegex = FORM_CONSTANTS.REGEX.PASSWORD;
    return passwordRegex.test(value);
  },

  role: (value: string): boolean => {
    const validRoles = Object.values(UserRole);
    return validRoles.includes(value as UserRole);
  },

  weight: (value: number): boolean => {
    return value > 0 && value <= 100;
  },

  length: (value: number): boolean => {
    return value > 0 && value <= 3;
  },

  width: (value: number): boolean => {
    return value > 0 && value <= 3;
  },

  height: (value: number): boolean => {
    return value > 0 && value <= 3;
  },

  async validateAddress(address: string): Promise<boolean> {
    try {
      const response = await axios.get(API_ROUTES.EXTERNAL.NOMINATIM, {
        params: { q: address, format: 'json' },
      });

      return response.data.length > 0;
    } catch (error) {
      console.error('Error validating address:', error);
      return false;
    }
  },
};
