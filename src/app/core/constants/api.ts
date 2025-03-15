export const API_ROUTES = {
  BASE: '/api',
  AUTH: {
    BASE: '/auth',
    LOGIN: '/login',
    REGISTER: '/register',
  },
  USERS: {
    GET_USERS: '/users',
    GET_USER_BY_ID: '/users/:id',
    GET_USER_BY_EMAIL: '/users/email/:email',
    CREATE_USER: '/users',
    UPDATE_USER: '/users/:id',
    DELETE_USER: '/users/:id',
  },
};
