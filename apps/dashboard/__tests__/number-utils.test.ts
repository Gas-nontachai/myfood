import { toNumberOrNull } from '../lib/utils/number';

describe('toNumberOrNull', () => {
  it('converts numeric strings to numbers', () => {
    expect(toNumberOrNull('3')).toBe(3);
  });

  it('returns null for invalid values', () => {
    expect(toNumberOrNull('abc')).toBeNull();
    expect(toNumberOrNull(undefined)).toBeNull();
  });

  it('returns finite numbers as-is', () => {
    expect(toNumberOrNull(42)).toBe(42);
  });
});
