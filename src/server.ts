import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from '@config/mySql';
import userRoutes from '@features/users/userRoutes';
import { API_ROUTES } from '@app/core/constants/api';
import authRoutes from '@app/features/auth/authRoutes';
import orderRoutes from '@app/features/orders/orderRoutes';
import routeRoutes from '@app/features/routes/routeRoutes';
import { setupSwagger } from '@config/swagger';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

setupSwagger(app);

app.get('/', (req, res) => {
  res.send('Express + TypeScript Server is running! 🚀');
});

app.use(API_ROUTES.BASE, userRoutes);
app.use(API_ROUTES.AUTH.BASE, authRoutes);
app.use(API_ROUTES.BASE, orderRoutes);
app.use(API_ROUTES.BASE, routeRoutes);

app.listen(PORT, () => {
  console.log(
    `🦌 Antiqua et Nova: Ad Maiorem Dei Gloriam et in Honorem Beatissimae Virginis Mariae. http://localhost:${PORT}`
  );
});

(async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ MySQL Connected!');
    connection.release();
  } catch (error) {
    console.error('❌ MySQL Connection Failed:', error);
  }
})();

export default app;
