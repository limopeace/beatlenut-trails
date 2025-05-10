const ExampleService = require('../../src/services/exampleService');

describe('ExampleService', () => {
  let exampleService;
  let mockRepository;

  beforeEach(() => {
    mockRepository = {
      findAll: jest.fn(),
      findById: jest.fn(),
      create: jest.fn()
    };
    exampleService = new ExampleService(mockRepository);
  });

  describe('findAll', () => {
    test('should return array of examples', async () => {
      const examples = await exampleService.findAll();
      
      expect(Array.isArray(examples)).toBe(true);
      expect(examples.length).toBeGreaterThan(0);
      expect(examples[0]).toHaveProperty('id');
      expect(examples[0]).toHaveProperty('name');
      expect(examples[0]).toHaveProperty('createdAt');
    });
  });

  describe('findById', () => {
    test('should find example by id', async () => {
      const example = await exampleService.findById(1);
      
      expect(example).toBeDefined();
      expect(example).toHaveProperty('id', 1);
      expect(example).toHaveProperty('name');
      expect(example).toHaveProperty('createdAt');
    });

    test('should throw error if id is not provided', async () => {
      await expect(exampleService.findById()).rejects.toThrow('ID is required');
    });
  });

  describe('create', () => {
    test('should create example with valid data', async () => {
      const data = { name: 'Test Example' };
      const example = await exampleService.create(data);
      
      expect(example).toBeDefined();
      expect(example).toHaveProperty('id');
      expect(example).toHaveProperty('name', 'Test Example');
      expect(example).toHaveProperty('createdAt');
    });

    test('should throw error if name is not provided', async () => {
      await expect(exampleService.create({})).rejects.toThrow('Name is required');
      await expect(exampleService.create(null)).rejects.toThrow('Name is required');
    });
  });
});