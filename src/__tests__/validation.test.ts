import { validateGetCustomersParams, validateGetCustomerByIdParams } from '../utils/validation';

describe('Validation', () => {
  describe('validateGetCustomersParams', () => {
    it('should return default values when no params provided', () => {
      const result = validateGetCustomersParams({});
      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
      expect(result.search).toBeUndefined();
    });

    it('should parse valid page and limit', () => {
      const result = validateGetCustomersParams({ page: '2', limit: '20' });
      expect(result.page).toBe(2);
      expect(result.limit).toBe(20);
    });

    it('should clamp page to minimum of 1', () => {
      const result = validateGetCustomersParams({ page: '0', limit: '10' });
      expect(result.page).toBe(1);
    });

    it('should clamp limit to minimum of 1', () => {
      const result = validateGetCustomersParams({ page: '1', limit: '0' });
      expect(result.limit).toBe(1);
    });

    it('should clamp limit to maximum of 100', () => {
      const result = validateGetCustomersParams({ page: '1', limit: '200' });
      expect(result.limit).toBe(100);
    });

    it('should trim and set search term', () => {
      const result = validateGetCustomersParams({ search: '  john  ' });
      expect(result.search).toBe('john');
    });

    it('should handle invalid page by defaulting to 1', () => {
      const result = validateGetCustomersParams({ page: 'invalid' });
      expect(result.page).toBe(1);
    });

    it('should handle invalid limit by defaulting to 10', () => {
      const result = validateGetCustomersParams({ limit: 'invalid' });
      expect(result.limit).toBe(10);
    });
  });

  describe('validateGetCustomerByIdParams', () => {
    it('should parse valid id', () => {
      const result = validateGetCustomerByIdParams('123');
      expect(result.id).toBe(123);
    });

    it('should throw error for invalid id', () => {
      expect(() => validateGetCustomerByIdParams('invalid')).toThrow('Invalid customer ID');
    });

    it('should throw error for negative id', () => {
      expect(() => validateGetCustomerByIdParams('-1')).toThrow('Invalid customer ID');
    });

    it('should throw error for zero id', () => {
      expect(() => validateGetCustomerByIdParams('0')).toThrow('Invalid customer ID');
    });
  });
});
