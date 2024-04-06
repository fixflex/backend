import { createAccessToken } from '../../src/helpers';
import { randomNum } from '../../src/helpers';
describe('Utils', () => {
  describe('createAccessToken', () => {
    it('should return a string', () => {
      expect(typeof createAccessToken('123')).toBe('string');
    });
    it('should return a string with the correct format', () => {
      expect(createAccessToken('123')).toMatch(/^eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9/);
    });
  });

  describe('Random Number', () => {
    it('should return a number consisting of 6 digits', () => {
      expect(randomNum(6).toString().length).toBe(6);
    });
  });

})
