import pool from '@config/mySql';
import redis from '@config/redisClient';
import { MySQLRouteRepository } from '@app/features/routes/MySQLRouteRepository';
import { RouteStatus } from '@app/core/models/Route.model';

jest.mock('@config/mySql', () => ({
  getConnection: jest.fn(),
}));

jest.mock('@config/redisClient', () => ({
  del: jest.fn(),
}));

describe('MySQLRouteRepository', () => {
  let routeRepository: MySQLRouteRepository;
  let mockConnection: any;

  beforeEach(() => {
    routeRepository = new MySQLRouteRepository();

    mockConnection = {
      beginTransaction: jest.fn(),
      commit: jest.fn(),
      rollback: jest.fn(),
      release: jest.fn(),
      query: jest.fn(),
    };

    (pool.getConnection as jest.Mock).mockResolvedValue(mockConnection);
    jest.clearAllMocks();
  });

  test('updateRouteStatus() should update route and order statuses', async () => {
    mockConnection.query
      .mockResolvedValueOnce([{ affectedRows: 1 }])
      .mockResolvedValueOnce([[], []])
      .mockResolvedValueOnce([{ affectedRows: 1 }]);

    const result = await routeRepository.updateRouteStatus(
      'route123',
      RouteStatus.COMPLETED
    );

    expect(mockConnection.beginTransaction).toHaveBeenCalled();
    expect(mockConnection.query).toHaveBeenCalledWith(
      'UPDATE routes SET status = ? WHERE id = ?',
      [RouteStatus.COMPLETED, 'route123']
    );
    expect(mockConnection.commit).toHaveBeenCalled();
    expect(redis.del).toHaveBeenCalledWith('order_status:route123');
    expect(result).toBe(true);
  });

  test('updateRouteStatus() should return false if route update fails', async () => {
    mockConnection.query.mockResolvedValueOnce([{ affectedRows: 0 }]);

    const result = await routeRepository.updateRouteStatus(
      'route123',
      RouteStatus.COMPLETED
    );

    expect(mockConnection.rollback).toHaveBeenCalled();
    expect(mockConnection.release).toHaveBeenCalled();
    expect(result).toBe(false);
  });

  test('updateCurrentStop() should update current stop and complete orders', async () => {
    mockConnection.query
      .mockResolvedValueOnce([[{ current_stop_order: 1, total_stops: 3 }]])
      .mockResolvedValueOnce([{ affectedRows: 1 }])
      .mockResolvedValueOnce([[{ id: 'order456' }]])
      .mockResolvedValueOnce([{ affectedRows: 1 }])
      .mockResolvedValueOnce([{ affectedRows: 1 }]);

    const result = await routeRepository.updateCurrentStop('route123');

    expect(mockConnection.beginTransaction).toHaveBeenCalled();
    expect(mockConnection.query).toHaveBeenCalledWith(
      expect.stringContaining('SELECT current_stop_order'),
      ['route123', 'route123']
    );
    expect(mockConnection.query).toHaveBeenCalledWith(
      expect.stringContaining(
        'UPDATE routes SET current_stop_order = ? WHERE id = ?'
      ),
      [2, 'route123']
    );
    expect(mockConnection.commit).toHaveBeenCalled();
    expect(redis.del).toHaveBeenCalledWith('order_status:route123');
    expect(result).toBe(true);
  });

  test('updateCurrentStop() should return false if route does not exist', async () => {
    mockConnection.query.mockResolvedValueOnce([[], []]);

    const result = await routeRepository.updateCurrentStop('route123');

    expect(mockConnection.rollback).toHaveBeenCalled();
    expect(mockConnection.release).toHaveBeenCalled();
    expect(result).toBe(false);
  });

  test('updateCurrentStop() should return false if current stop cannot be updated', async () => {
    mockConnection.query
      .mockResolvedValueOnce([[{ current_stop_order: 1, total_stops: 3 }]])
      .mockResolvedValueOnce([{ affectedRows: 0 }]);

    const result = await routeRepository.updateCurrentStop('route123');

    expect(mockConnection.rollback).toHaveBeenCalled();
    expect(mockConnection.release).toHaveBeenCalled();
    expect(result).toBe(false);
  });

  test('updateCurrentStop() should rollback in case of error', async () => {
    mockConnection.query.mockRejectedValue(new Error('DB Error'));

    const result = await routeRepository.updateCurrentStop('route123');

    expect(mockConnection.rollback).toHaveBeenCalled();
    expect(mockConnection.release).toHaveBeenCalled();
    expect(result).toBe(false);
  });
});
