/**
 * Constraints:
 * - n: any integer
 *
 * Assumptions:
 * - The input will always produce a result lesser than Number.MAX_SAFE_INTEGER 
 *   and greater than Number.MIN_SAFE_INTEGER.
 * - The output is the summation to n:
 *     - If n is 0: sumToN(0) === 0
 *     - If n is positive: sumToN(5) === 1 + 2 + 3 + 4 + 5 === 15
 *     - If n is negative: sumToN(-5) === -1 + -2 + -3 + -4 + -5 === -15
 */

/**
 * Approach A: Using a Loop
 * Time complexity  : O(n)
 * Space complexity : O(1)
 * @param {number} n - An integer
 * @returns {number} - Summation to n
 */
function sumToN_A(n: number): number {
  let sum = 0;

  if (n >= 0) {
    for (let i = 1; i <= n; i++) {
      sum += i;
    }
  } else {
    for (let i = -1; i >= n; i--) {
      sum += i;
    }
  }
  
  return sum;
}


/**
 * Approach B: Using a Formula (Recommended)
 * Time complexity  : O(1)
 * Space complexity : O(1)
 * @param {number} n - An integer
 * @returns {number} - Summation to n
 */
function sumToN_B(n: number): number {
  return n >= 0 ? (n * (n + 1)) / 2 : -(((-n) * (-n + 1)) / 2);
}


/**
 * Approach C: Using recursion
 * Time complexity  : O(n)
 * Space complexity : O(n)
 * @param {number} n - An integer
 * @returns {number} - Summation to n
 */
function sumToN_C(n: number): number {
  if (n === 0) {
    return 0;
  }

  return n + sumToN_C(n > 0 ? n - 1 : n + 1);
}

export { sumToN_A, sumToN_B, sumToN_C };
