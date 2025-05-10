const exampleController = require('../../src/controllers/example');
const ExampleModel = require('../../src/models/example');

// Mock dependencies
jest.mock('../../src/models/example');

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
      await exampleController.getAll(req, res, next);
      
      expect(res.json).toHaveBeenCalled();
      expect(res.json.mock.calls[0][0]).toBeInstanceOf(Array);
    });
  });

  describe('getById', () => {
    test('should return example when found', async () => {
      const mockExample = new ExampleModel({ id: '123', name: 'Test' });
      ExampleModel.findById.mockResolvedValue(mockExample);
      
      req.params.id = '123';
      
      await exampleController.getById(req, res, next);
      
      expect(ExampleModel.findById).toHaveBeenCalledWith('123');
      expect(res.json).toHaveBeenCalledWith(mockExample);
    });

    test('should return 404 when example not found', async () => {
      ExampleModel.findById.mockResolvedValue(null);
      
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
      req.body = { name: 'New Example' };
      
      await exampleController.create(req, res, next);
      
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        name: 'New Example'
      }));
    });
  });
});