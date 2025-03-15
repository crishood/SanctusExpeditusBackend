import { UserRole } from '@app/core/models/User.model';
import { FORM_CONSTANTS } from '@app/core/constants/forms';
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
};
