import { randomBytes } from 'crypto';

/**
 * Generates a random integer between the given `min` and `max` values (inclusive).
 *
 * @param {number} min - The minimum value that the random integer can be.
 * @param {number} max - The maximum value that the random integer can be.
 * @returns {number} A random integer between `min` and `max` (inclusive).
 *
 * @example
 * // Generates a random integer between 1 and 10 (inclusive)
 * const result = randomInt(1, 10);
 */
export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Returns a random element from an array.
 * @param {T[]} array - The array from which to select a random element.
 * @returns {T} - A random element from the array.
 */
export function getRandomIndex<T>(array: T[]): T {
  const randomIndex = Math.floor(Math.random() * array.length);

  return array[randomIndex];
}

/**
 * Generates a random date for a given year.
 * The generated date will have a random month (0-11) and a random day (1-28) to avoid month-end issues.
 *
 * @param {number} year - The year for which the random date should be generated.
 * @returns {Date} A random Date object with the provided year, a random month, and a random day.
 *
 * @example
 * // Generates a random date in the year 2023
 * const randomDate = generateRandomDate(2023);
 */
export function generateRandomDate(year: number): Date {
  const month = Math.floor(Math.random() * 12);
  const day = Math.floor(Math.random() * 28);

  return new Date(year, month, day);
}

/**
 * Generates a random 64-character hexadecimal string to simulate a user key.
 * This function uses the `crypto.randomBytes` method to generate a secure random value
 * and converts it to a hexadecimal string representation.
 *
 * @returns {string} A 64-character long hexadecimal string representing the user key.
 *
 * @example
 * // Generates a random key like 'fbb4b6e8335cd1bca94f11ea1b3a1b6f'
 * const userKey = generateRandomUserKey();
 */
export function generateRandomKey(): string {
  // 64-character hexadecimal string
  return randomBytes(32).toString('hex');
}
