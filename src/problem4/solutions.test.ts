import { sumToN_A, sumToN_B, sumToN_C } from './solutions';
import { describe, expect, test } from '@jest/globals';

describe('sumToN_A', () => {
  test('should return 0 for n = 0', () => {
    expect(sumToN_A(0)).toBe(0);
  });

  test('should return 15 for n = 5', () => {
    expect(sumToN_A(5)).toBe(15);
  });

  test('should return -15 for n = -5', () => {
    expect(sumToN_A(-5)).toBe(-15);
  });
});

describe('sumToN_B', () => {
  test('should return 0 for n = 0', () => {
    expect(sumToN_B(0)).toBe(0);
  });

  test('should return 15 for n = 5', () => {
    expect(sumToN_B(5)).toBe(15);
  });

  test('should return -15 for n = -5', () => {
    expect(sumToN_B(-5)).toBe(-15);
  });
});

describe('sumToN_C', () => {
  test('should return 0 for n = 0', () => {
    expect(sumToN_C(0)).toBe(0);
  });

  test('should return 15 for n = 5', () => {
    expect(sumToN_C(5)).toBe(15);
  });

  test('should return -15 for n = -5', () => {
    expect(sumToN_C(-5)).toBe(-15);
  });
});
