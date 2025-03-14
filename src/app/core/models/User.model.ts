export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'customer' | 'driver';
  created_at: Date;
}
