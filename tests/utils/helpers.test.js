const helpers = require('../../src/utils/helpers');

describe('Helper Utilities', () => {
  describe('formatDate', () => {
    test('should format date to ISO string', () => {
      const date = new Date('2023-01-01T12:00:00Z');
      expect(helpers.formatDate(date)).toBe('2023-01-01T12:00:00.000Z');
    });

    test('should use current date if none provided', () => {
      const result = helpers.formatDate();
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
    });
  });

  describe('slugify', () => {
    test('should convert string to slug format', () => {
      expect(helpers.slugify('Hello World')).toBe('hello-world');
      expect(helpers.slugify('Hello & World')).toBe('hello-and-world');
      expect(helpers.slugify('Special $#@ Characters')).toBe('special-characters');
      expect(helpers.slugify('Multiple   Spaces')).toBe('multiple-spaces');
    });
  });

  describe('generateId', () => {
    test('should generate random ID with default length', () => {
      const id = helpers.generateId();
      expect(id).toHaveLength(6);
      expect(id).toMatch(/^[A-Za-z0-9]+$/);
    });

    test('should generate random ID with specified length', () => {
      const id = helpers.generateId(10);
      expect(id).toHaveLength(10);
    });
  });
});