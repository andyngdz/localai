const MAX_31_BIT_INT = 0x7fffffff;

class SeedService {
  /**
   * Generates a random 31-bit integer seed based on the current timestamp.
   * This is useful for seeding random number generators.
   * @returns {number} A 31-bit integer seed.
   */
  generate(): number {
    // Use Date.now() for better performance and to avoid external dependencies.
    // The bitwise AND with MAX_31_BIT_INT ensures the seed is a positive 31-bit integer.
    return Date.now() & MAX_31_BIT_INT;
  }
}

export const seedService = new SeedService();
