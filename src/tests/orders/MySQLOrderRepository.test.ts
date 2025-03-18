import pool from '@config/mySql';
import redis from '@config/redisClient';
import { MySQLOrderRepository } from '@app/features/orders/MySQLOrderRepository';
import { OrderStatus } from '@app/core/models/Order.model';
import { ERROR_MESSAGES } from '@app/core/constants/errors';

jest.mock('@config/mySql', () => ({
  query: jest.fn(),
}));

jest.mock('@config/redisClient', () => ({
  get: jest.fn(),
  setex: jest.fn(),
  del: jest.fn(),
}));

describe('MySQLOrderRepository', () => {
  let orderRepository: MySQLOrderRepository;

  beforeEach(() => {
    orderRepository = new MySQLOrderRepository();
    jest.clearAllMocks();
  });

  describe('getOrders', () => {
    test('should return all orders', async () => {
      const mockOrders = [
        {
          id: '1',
          user_id: 'user1',
          weight: 10,
          length: 20,
          width: 15,
          height: 10,
          product_type: 'electronics',
          delivery_city: 'New York',
          destination_address: '123 Main St',
          status: OrderStatus.PENDING,
        },
        {
          id: '2',
          user_id: 'user2',
          weight: 5,
          length: 10,
          width: 5,
          height: 5,
          product_type: 'clothes',
          delivery_city: 'Los Angeles',
          destination_address: '456 Oak Ave',
          status: OrderStatus.IN_TRANSIT,
        },
      ];

      (pool.query as jest.Mock).mockResolvedValue([mockOrders, []]);

      const result = await orderRepository.getOrders();

      expect(pool.query).toHaveBeenCalledWith('SELECT * FROM orders');
      expect(result).toEqual(mockOrders);
    });
  });

  describe('getOrderById', () => {
    test('should return an order if it exists', async () => {
      const mockOrder = {
        id: '1',
        user_id: 'user1',
        weight: 10,
        length: 20,
        width: 15,
        height: 10,
        product_type: 'electronics',
        delivery_city: 'New York',
        destination_address: '123 Main St',
        status: OrderStatus.PENDING,
      };

      (pool.query as jest.Mock).mockResolvedValue([[mockOrder], []]);

      const result = await orderRepository.getOrderById('1');

      expect(pool.query).toHaveBeenCalledWith(
        'SELECT * FROM orders WHERE id = ?',
        ['1']
      );
      expect(result).toEqual(mockOrder);
    });

    test('should return null if order does not exist', async () => {
      (pool.query as jest.Mock).mockResolvedValue([[], []]);

      const result = await orderRepository.getOrderById('999');

      expect(pool.query).toHaveBeenCalledWith(
        'SELECT * FROM orders WHERE id = ?',
        ['999']
      );
      expect(result).toBeNull();
    });
  });

  describe('getOrderStatusHistory', () => {
    test('should return status history from cache if available', async () => {
      const mockStatusHistory = [
        {
          id: '1',
          order_id: '1',
          status: OrderStatus.PENDING,
          changed_at: new Date().toISOString(),
        },
        {
          id: '2',
          order_id: '1',
          status: OrderStatus.IN_TRANSIT,
          changed_at: new Date().toISOString(),
        },
      ];

      (redis.get as jest.Mock).mockResolvedValue(
        JSON.stringify(mockStatusHistory)
      );

      const result = await orderRepository.getOrderStatusHistory('1');

      expect(redis.get).toHaveBeenCalledWith('order_status:1');
      expect(pool.query).not.toHaveBeenCalled();
      expect(result).toEqual(mockStatusHistory);
    });

    test('should fetch status history from database and cache it if not in cache', async () => {
      const mockStatusHistory = [
        {
          id: '1',
          order_id: '1',
          status: OrderStatus.PENDING,
          changed_at: new Date(),
        },
        {
          id: '2',
          order_id: '1',
          status: OrderStatus.IN_TRANSIT,
          changed_at: new Date(),
        },
      ];

      (redis.get as jest.Mock).mockResolvedValue(null);
      (pool.query as jest.Mock).mockResolvedValue([mockStatusHistory, []]);

      const result = await orderRepository.getOrderStatusHistory('1');

      expect(redis.get).toHaveBeenCalledWith('order_status:1');
      expect(pool.query).toHaveBeenCalledWith(
        'SELECT * FROM order_status_history WHERE order_id = ?',
        ['1']
      );
      expect(redis.setex).toHaveBeenCalledWith(
        'order_status:1',
        1200,
        JSON.stringify(mockStatusHistory)
      );
      expect(result).toEqual(mockStatusHistory);
    });
  });

  describe('createOrder', () => {
    test('should create an order and return it with the inserted ID', async () => {
      const newOrder = {
        user_id: 'user1',
        weight: 10,
        length: 20,
        width: 15,
        height: 10,
        product_type: 'electronics',
        delivery_city: 'New York',
        destination_address: '123 Main St',
        user_email: 'user1@example.com',
      };

      const mockInsertResult = [{ insertId: 1 }, []];
      const mockSelectResult = [[{ id: '1' }], []];

      (pool.query as jest.Mock)
        .mockResolvedValueOnce(mockInsertResult)
        .mockResolvedValueOnce(mockSelectResult);

      const result = await orderRepository.createOrder(newOrder);

      expect(pool.query).toHaveBeenCalledWith(
        'INSERT INTO orders (user_id, weight, length, width, height, product_type, delivery_city, destination_address, user_email) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [
          newOrder.user_id,
          newOrder.weight,
          newOrder.length,
          newOrder.width,
          newOrder.height,
          newOrder.product_type,
          newOrder.delivery_city,
          newOrder.destination_address,
          newOrder.user_email,
        ]
      );
      expect(pool.query).toHaveBeenCalledWith(
        'SELECT id FROM orders WHERE user_id = ? ORDER BY created_at DESC LIMIT 1',
        [newOrder.user_id]
      );
      expect(result).toEqual({ ...newOrder, order_id: '1' });
    });
  });

  describe('updateOrderStatus', () => {
    test('should update order status and clear cache', async () => {
      const mockResult = [{ affectedRows: 1 }, []];
      (pool.query as jest.Mock).mockResolvedValue(mockResult);

      const result = await orderRepository.updateOrderStatus(
        '1',
        OrderStatus.IN_TRANSIT
      );

      expect(pool.query).toHaveBeenCalledWith(
        'UPDATE orders SET status = ? WHERE id = ?',
        [OrderStatus.IN_TRANSIT, '1']
      );
      expect(redis.del).toHaveBeenCalledWith('order_status:1');
      expect(result).toEqual({ id: '1', status: OrderStatus.IN_TRANSIT });
    });

    test('should return null if order does not exist', async () => {
      const mockResult = [{ affectedRows: 0 }, []];
      (pool.query as jest.Mock).mockResolvedValue(mockResult);

      const result = await orderRepository.updateOrderStatus(
        '999',
        OrderStatus.IN_TRANSIT
      );

      expect(pool.query).toHaveBeenCalledWith(
        'UPDATE orders SET status = ? WHERE id = ?',
        [OrderStatus.IN_TRANSIT, '999']
      );
      expect(redis.del).toHaveBeenCalledWith('order_status:999');
      expect(result).toBeNull();
    });
  });

  describe('validateOrderAndRoute', () => {
    test('should return success when order and route are valid', async () => {
      const mockOrder = {
        delivery_city: 'New York',
        weight: 10,
        width: 15,
        height: 10,
        length: 20,
        route_id: null,
      };

      const mockRoute = {
        id: 'route1',
        transporter_id: 'transporter1',
        destination: 'Boston',
      };

      const mockStops = [{ city: 'New York' }];

      const mockTransporter = {
        max_weight: 100,
        max_volume: 5000,
      };

      (pool.query as jest.Mock)
        .mockResolvedValueOnce([[mockOrder], []])
        .mockResolvedValueOnce([[mockRoute], []])
        .mockResolvedValueOnce([mockStops, []])
        .mockResolvedValueOnce([[mockTransporter], []]);

      const result = await orderRepository.validateOrderAndRoute('1', 'route1');

      expect(pool.query).toHaveBeenCalledTimes(4);
      expect(result).toEqual({ success: true });
    });

    test('should return error when order not found', async () => {
      (pool.query as jest.Mock).mockResolvedValueOnce([[], []]);

      const result = await orderRepository.validateOrderAndRoute(
        '999',
        'route1'
      );

      expect(result).toEqual({
        success: false,
        error: ERROR_MESSAGES.ORDER_NOT_FOUND,
      });
    });

    test('should return error when order already has the same route', async () => {
      const mockOrder = {
        delivery_city: 'New York',
        weight: 10,
        width: 15,
        height: 10,
        length: 20,
        route_id: 'route1',
      };

      (pool.query as jest.Mock).mockResolvedValueOnce([[mockOrder], []]);

      const result = await orderRepository.validateOrderAndRoute('1', 'route1');

      expect(result).toEqual({
        success: false,
        error: ERROR_MESSAGES.ORDER_ALREADY_HAS_ROUTE,
      });
    });

    test('should return error when route not found', async () => {
      const mockOrder = {
        delivery_city: 'New York',
        weight: 10,
        width: 15,
        height: 10,
        length: 20,
        route_id: null,
      };

      (pool.query as jest.Mock)
        .mockResolvedValueOnce([[mockOrder], []])
        .mockResolvedValueOnce([[], []]);

      const result = await orderRepository.validateOrderAndRoute(
        '1',
        'route999'
      );

      expect(result).toEqual({
        success: false,
        error: ERROR_MESSAGES.ROUTE_NOT_FOUND,
      });
    });

    test('should return error when delivery city is invalid', async () => {
      const mockOrder = {
        delivery_city: 'Chicago',
        weight: 10,
        width: 15,
        height: 10,
        length: 20,
        route_id: null,
      };

      const mockRoute = {
        id: 'route1',
        transporter_id: 'transporter1',
        destination: 'Boston',
      };

      (pool.query as jest.Mock)
        .mockResolvedValueOnce([[mockOrder], []])
        .mockResolvedValueOnce([[mockRoute], []])
        .mockResolvedValueOnce([[], []]);

      const result = await orderRepository.validateOrderAndRoute('1', 'route1');

      expect(result).toEqual({
        success: false,
        error: ERROR_MESSAGES.INVALID_DELIVERY_CITY,
      });
    });

    test('should return error when transporter capacity is insufficient', async () => {
      const mockOrder = {
        delivery_city: 'New York',
        weight: 100,
        width: 20,
        height: 20,
        length: 20,
        route_id: null,
      };

      const mockRoute = {
        id: 'route1',
        transporter_id: 'transporter1',
        destination: 'Boston',
      };

      const mockStops = [{ city: 'New York' }];

      const mockTransporter = {
        max_weight: 50,
        max_volume: 5000,
      };

      (pool.query as jest.Mock)
        .mockResolvedValueOnce([[mockOrder], []])
        .mockResolvedValueOnce([[mockRoute], []])
        .mockResolvedValueOnce([mockStops, []])
        .mockResolvedValueOnce([[mockTransporter], []]);

      const result = await orderRepository.validateOrderAndRoute('1', 'route1');

      expect(result).toEqual({
        success: false,
        error: ERROR_MESSAGES.INSUFFICIENT_CAPACITY,
      });
    });
  });

  describe('updateOrderRoute', () => {
    test('should update order route', async () => {
      const mockResult = [{ affectedRows: 1 }, []];
      (pool.query as jest.Mock).mockResolvedValue(mockResult);

      const result = await orderRepository.updateOrderRoute('1', 'route1');

      expect(pool.query).toHaveBeenCalledWith(
        'UPDATE orders SET route_id = ? WHERE id = ?',
        ['route1', '1']
      );
      expect(result).toEqual({ id: '1', route_id: 'route1' });
    });

    test('should return null if order does not exist', async () => {
      const mockResult = [{ affectedRows: 0 }, []];
      (pool.query as jest.Mock).mockResolvedValue(mockResult);

      const result = await orderRepository.updateOrderRoute('999', 'route1');

      expect(pool.query).toHaveBeenCalledWith(
        'UPDATE orders SET route_id = ? WHERE id = ?',
        ['route1', '999']
      );
      expect(result).toBeNull();
    });
  });

  describe('updateTransporterCapacity', () => {
    test('should update transporter capacity and return true if successful', async () => {
      const mockResult = [{ affectedRows: 1 }, []];
      (pool.query as jest.Mock).mockResolvedValue(mockResult);

      const result = await orderRepository.updateTransporterCapacity(
        'route1',
        '1'
      );

      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE transporters'),
        ['1', '1', 'route1', '1', '1']
      );
      expect(result).toBe(true);
    });

    test('should return false if update fails', async () => {
      const mockResult = [{ affectedRows: 0 }, []];
      (pool.query as jest.Mock).mockResolvedValue(mockResult);

      const result = await orderRepository.updateTransporterCapacity(
        'route1',
        '1'
      );

      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE transporters'),
        ['1', '1', 'route1', '1', '1']
      );
      expect(result).toBe(false);
    });
  });

  describe('addOrderStatusHistory', () => {
    test('should add status history and clear cache', async () => {
      (pool.query as jest.Mock).mockResolvedValue([{ affectedRows: 1 }, []]);

      await orderRepository.addOrderStatusHistory(
        '1',
        OrderStatus.IN_TRANSIT,
        'Order in transit'
      );

      expect(pool.query).toHaveBeenCalledWith(
        'INSERT INTO order_status_history (order_id, status, comment) VALUES (?, ?, ?)',
        ['1', OrderStatus.IN_TRANSIT, 'Order in transit']
      );
      expect(redis.del).toHaveBeenCalledWith('order_status:1');
    });

    test('should add status history without comment', async () => {
      (pool.query as jest.Mock).mockResolvedValue([{ affectedRows: 1 }, []]);

      await orderRepository.addOrderStatusHistory('1', OrderStatus.IN_TRANSIT);

      expect(pool.query).toHaveBeenCalledWith(
        'INSERT INTO order_status_history (order_id, status, comment) VALUES (?, ?, ?)',
        ['1', OrderStatus.IN_TRANSIT, undefined]
      );
      expect(redis.del).toHaveBeenCalledWith('order_status:1');
    });
  });
});
