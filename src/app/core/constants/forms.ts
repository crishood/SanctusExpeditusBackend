export const FORM_CONSTANTS = {
  REGEX: {
    NUMBER: /^\d+$/,
    DECIMAL: /^\d*\.?\d+$/,
    LETTERS: /^[\p{L}\s.]+$/u,
    CODE: /^[A-Za-z0-9._+-]+$/,
    EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    EMAIL_INPUT: /^[A-Za-z0-9._%+-@]$/,
    PASSWORD:
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/,
  },
};
