export const API_ROUTES = {
  BASE: '/api',
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
  },
  USERS: {
    GET_USERS: '/users',
    GET_USER_BY_ID: '/users/:id',
    CREATE_USER: '/users',
    UPDATE_USER: '/users/:id',
    DELETE_USER: '/users/:id',
  },
};
