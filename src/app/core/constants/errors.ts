import { PACKAGE_TYPES } from './package';
import { UserRole } from '@app/core/models/User.model';
export const ERROR_MESSAGES = {
  INTERNAL_SERVER_ERROR:
    'Oops! Something went wrong on our end. Our team has been notified and is working on it.',
  NOT_FOUND: "We looked everywhere, but couldn't find what you're looking for.",
  BAD_REQUEST:
    "Something's not quite right with this request. Please check your input and try again.",
  UNAUTHORIZED: 'Hold on! You need to sign in to access this.',
  FORBIDDEN: 'Sorry, this area is off-limits for your current access level.',
  EMAIL_ALREADY_IN_USE:
    'This email is already taken. Please try another one or sign in if this is you.',
  INVALID_EMAIL_OR_PASSWORD:
    "The email or password doesn't match our records. Please try again.",
  ACCESS_DENIED:
    "You don't have permission to perform this action. Need higher access? Contact your administrator.",
  ACCESS_DENIED_NO_TOKEN:
    'Your session token is missing. Please sign in again to continue.',
  INVALID_TOKEN:
    'Your session has expired or is invalid. Please sign in again to continue.',
  INVALID_ROLE: `Please enter a valid role: ${Object.values(UserRole).join(', ')}`,
  INVALID_PASSWORD:
    'Your password needs to be at least 8 characters long and include: \n• One uppercase letter\n• One lowercase letter\n• One number\n• One special character(e.g., !@#$%^&.,)',
  INVALID_EMAIL: 'Please enter a valid email address (e.g., name@example.com)',
  INVALID_NAME:
    'Please enter a valid name using letters and common special characters',
  MISSING_CREDENTIALS: 'Please provide both email and password to continue',
  FORBIDDEN_FIELDS:
    'These fields cannot be modified: id, created_at, role, and password. Please adjust your request.',
  USER_NOT_FOUND:
    "We couldn't find an account with these details. Need to create one?",
  INVALID_USER_INPUT:
    'Please check your input and try again. Ensure all fields are filled correctly.',
  INVALID_ORDER_INPUT:
    'Please check your input and try again. Ensure you have filled all the necessary fields for your order.',
  ORDER_NOT_FOUND:
    "We couldn't find an order with these details. Need to create one?",
  ORDER_ALREADY_HAS_ROUTE: 'The order has already been assigned to this route.',
  ROUTE_NOT_FOUND:
    "We couldn't find a route with these details. Need to create one?",
  INVALID_ORDER_STATUS:
    'Please check your input and try again. Ensure the status is valid.',
  INVALID_ORDER_FIELDS: `Please check your order and try again. Remember the max dimensions are ${PACKAGE_TYPES.MAX_LENGTH}cm x ${PACKAGE_TYPES.MAX_WIDTH}cm x ${PACKAGE_TYPES.MAX_HEIGHT}cm and the max weight is ${PACKAGE_TYPES.MAX_WEIGHT}kg.`,
  INVALID_ORDER_ADDRESS:
    'Please check your address and try again. Ensure it is a valid address.',
  PACKAGE_TOO_BIG:
    'The package is too big for this route. Please check your order and try again.',
  ERROR_ASSIGNING_ROUTE:
    'An error occurred while assigning the route to the order. Please try again.',
  INVALID_DELIVERY_CITY:
    'The delivery city is invalid. Please check your order and try again.',
  INSUFFICIENT_CAPACITY:
    'The transporter does not have enough capacity to deliver the order. Please check your order and try again.',
};
