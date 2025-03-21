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
    GET_USER_BY_EMAIL: '/users/email',
    CREATE_USER: '/users',
    UPDATE_USER: '/users/:id',
    DELETE_USER: '/users/:id',
  },
  ORDERS: {
    GET_ORDERS: '/orders',
    GET_ORDER_BY_ID: '/orders/user/:id',
    CREATE_ORDER: '/orders',
    GET_ORDERS_BY_USER_EMAIL: '/orders/email',
    UPDATE_ORDER_STATUS: '/orders/:id/status',
    UPDATE_ORDER_ROUTE: '/orders/:id/route',
    GET_ORDER_STATUS_HISTORY: '/orders/:id/history',
  },
  ROUTES: {
    UPDATE_ROUTE_STATUS: '/routes/:id/status',
    UPDATE_ROUTE_CURRENT_STOP: '/routes/:id/current-stop',
    GET_ROUTES: '/routes',
  },
  EXTERNAL: {
    NOMINATIM: 'https://nominatim.openstreetmap.org/search',
  },
};
