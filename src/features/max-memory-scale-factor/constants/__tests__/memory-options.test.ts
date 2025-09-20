import { describe, expect, it } from 'vitest'
import { MEMORY_OPTIONS } from '../memory-options'

describe('MEMORY_OPTIONS Constants', () => {
  it('should have the correct number of memory options', () => {
    expect(MEMORY_OPTIONS).toHaveLength(5)
  })

  it('should have scale factors in ascending order', () => {
    const scaleFactors = MEMORY_OPTIONS.map((option) => option.scaleFactor)
    const sortedScaleFactors = [...scaleFactors].sort((a, b) => a - b)
    expect(scaleFactors).toEqual(sortedScaleFactors)
  })

  it('should have all scale factors between 0 and 1', () => {
    MEMORY_OPTIONS.forEach((option) => {
      expect(option.scaleFactor).toBeGreaterThan(0)
      expect(option.scaleFactor).toBeLessThanOrEqual(1)
    })
  })

  it('should have labels formatted as percentages', () => {
    MEMORY_OPTIONS.forEach((option) => {
      expect(option.label).toMatch(/^\d{2}%$/)
    })
  })

  it('should have labels that correspond to scale factors', () => {
    MEMORY_OPTIONS.forEach((option) => {
      const percentValue = option.scaleFactor * 100
      expect(option.label).toBe(`${percentValue}%`)
    })
  })

  it('should include specific scale factor values', () => {
    const expectedScaleFactors = [0.5, 0.6, 0.7, 0.8, 0.9]
    const actualScaleFactors = MEMORY_OPTIONS.map(
      (option) => option.scaleFactor
    )
    expect(actualScaleFactors).toEqual(expectedScaleFactors)
  })
})
