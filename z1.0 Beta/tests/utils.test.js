import { Utils } from '../src/shared/utils/utils';

describe('Utils Tests', () => {
  test('should format phone number correctly', () => {
    const formatted = Utils.formatPhoneNumber('+5511999999999');
    expect(formatted).toBe('5511999999999');
  });
});