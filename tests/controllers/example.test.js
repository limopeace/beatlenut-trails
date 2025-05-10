const exampleController = require('../../src/controllers/example');
const ExampleService = require('../../src/services/exampleService');

// Mock dependencies
jest.mock('../../src/services/exampleService');

// Mock ExampleService instance
ExampleService.mockImplementation(() => ({
  findAll: jest.fn(),
  findById: jest.fn(),
  create: jest.fn()
}));

describe('Example Controller', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      params: {},
      body: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
  });

  describe('getAll', () => {
    test('should return all examples', async () => {
      const mockService = ExampleService.mock.instances[0];
      const mockExamples = [
        { id: 1, name: 'Example 1' },
        { id: 2, name: 'Example 2' }
      ];
      mockService.findAll.mockResolvedValue(mockExamples);

      await exampleController.getAll(req, res, next);

      expect(mockService.findAll).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(mockExamples);
    });
  });

  describe('getById', () => {
    test('should return example when found', async () => {
      const mockExample = { id: '123', name: 'Test' };
      const mockService = ExampleService.mock.instances[0];
      mockService.findById.mockResolvedValue(mockExample);

      req.params.id = '123';

      await exampleController.getById(req, res, next);

      expect(mockService.findById).toHaveBeenCalledWith('123');
      expect(res.json).toHaveBeenCalledWith(mockExample);
    });

    test('should return 404 when example not found', async () => {
      const mockService = ExampleService.mock.instances[0];
      mockService.findById.mockResolvedValue(null);

      req.params.id = 'nonexistent';

      await exampleController.getById(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: expect.any(String)
      }));
    });
  });

  describe('create', () => {
    test('should create and return new example', async () => {
      const mockService = ExampleService.mock.instances[0];
      const createdExample = { id: 'new123', name: 'New Example' };
      mockService.create.mockResolvedValue(createdExample);

      req.body = { name: 'New Example' };

      await exampleController.create(req, res, next);

      expect(mockService.create).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(createdExample);
    });

    test('should return 400 when name is missing', async () => {
      const mockService = ExampleService.mock.instances[0];
      mockService.create.mockRejectedValue(new Error('Name is required'));

      req.body = {};

      await exampleController.create(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Name is required'
      }));
    });
  });
});