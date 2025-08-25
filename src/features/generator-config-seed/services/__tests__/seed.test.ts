import { describe, expect, it, vi } from 'vitest'
import { seedService } from '../seed'

describe('SeedService', () => {
  it('should generate a positive integer seed', () => {
    const seed = seedService.generate()
    expect(Number.isInteger(seed)).toBe(true)
    expect(seed).toBeGreaterThanOrEqual(0)
  })

  it('should generate a 31-bit integer (max value 2,147,483,647)', () => {
    const MAX_31_BIT_INT = 0x7fffffff // 2,147,483,647 (2^31 - 1)
    const seed = seedService.generate()
    expect(seed).toBeLessThanOrEqual(MAX_31_BIT_INT)
  })

  it('should generate different seeds over time', () => {
    // Mock Date.now() to return incremental values
    let currentTime = 1628000000000 // Example timestamp
    vi.spyOn(Date, 'now').mockImplementation(() => {
      currentTime += 100
      return currentTime
    })

    const seed1 = seedService.generate()
    const seed2 = seedService.generate()

    expect(seed1).not.toEqual(seed2)

    // Restore the original Date.now implementation
    vi.restoreAllMocks()
  })

  it('should use bitwise AND with MAX_31_BIT_INT to ensure 31-bit integer', () => {
    // Mock Date.now() to return a value that would exceed 31-bit integer
    vi.spyOn(Date, 'now').mockReturnValue(0x8fffffff) // Value with bit 32 set

    const seed = seedService.generate()
    const MAX_31_BIT_INT = 0x7fffffff // 2,147,483,647 (2^31 - 1)

    // The result should be less than MAX_31_BIT_INT
    expect(seed).toBeLessThanOrEqual(MAX_31_BIT_INT)

    // Restore the original Date.now implementation
    vi.restoreAllMocks()
  })
})
