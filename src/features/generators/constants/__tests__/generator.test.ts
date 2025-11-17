import { describe, expect, it } from 'vitest'
import { FORM_DEFAULT_VALUES } from '../generator'

describe('Generator Constants', () => {
  describe('FORM_DEFAULT_VALUES', () => {
    it('should have the correct default values', () => {
      expect(FORM_DEFAULT_VALUES).toEqual({
        width: 512,
        height: 512,
        hires_fix: false,
        number_of_images: 4,
        steps: 24,
        seed: -1,
        cfg_scale: 7.5,
        sampler: 'EULER_A',
        styles: [],
        prompt: '',
        negative_prompt: ''
      })
    })

    it('should have all required fields from GeneratorConfigFormValues', () => {
      // Test that all required fields are present
      const requiredFields = [
        'width',
        'height',
        'hires_fix',
        'number_of_images',
        'steps',
        'seed',
        'cfg_scale',
        'sampler',
        'styles',
        'prompt',
        'negative_prompt'
      ]

      requiredFields.forEach((field) => {
        expect(FORM_DEFAULT_VALUES).toHaveProperty(field)
      })
    })

    it('should have numeric values for numeric fields', () => {
      expect(typeof FORM_DEFAULT_VALUES.width).toBe('number')
      expect(typeof FORM_DEFAULT_VALUES.height).toBe('number')
      expect(typeof FORM_DEFAULT_VALUES.number_of_images).toBe('number')
      expect(typeof FORM_DEFAULT_VALUES.steps).toBe('number')
      expect(typeof FORM_DEFAULT_VALUES.seed).toBe('number')
      expect(typeof FORM_DEFAULT_VALUES.cfg_scale).toBe('number')
    })

    it('should have empty strings for prompt fields', () => {
      expect(FORM_DEFAULT_VALUES.prompt).toBe('')
      expect(FORM_DEFAULT_VALUES.negative_prompt).toBe('')
    })

    it('should have empty array for styles', () => {
      expect(Array.isArray(FORM_DEFAULT_VALUES.styles)).toBe(true)
      expect(FORM_DEFAULT_VALUES.styles.length).toBe(0)
    })

    it('should have boolean value for hires_fix', () => {
      expect(typeof FORM_DEFAULT_VALUES.hires_fix).toBe('boolean')
      expect(FORM_DEFAULT_VALUES.hires_fix).toBe(false)
    })
  })
})
