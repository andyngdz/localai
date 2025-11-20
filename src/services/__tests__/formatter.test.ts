import { describe, expect, it } from 'vitest'
import { formatter } from '../formatter'

describe('Formatter', () => {
  describe('formatBytes', () => {
    it('handles zero bytes', () => {
      expect(formatter.bytes(0)).toBe('0 B')
    })

    it('formats bytes correctly', () => {
      expect(formatter.bytes(1)).toBe('1 B')
      expect(formatter.bytes(999)).toBe('999 B')
    })

    it('formats KB correctly', () => {
      expect(formatter.bytes(1024)).toBe('1 KB')
      expect(formatter.bytes(1536)).toBe('1.5 KB')
      expect(formatter.bytes(10240)).toBe('10 KB')
    })

    it('formats MB correctly', () => {
      expect(formatter.bytes(1048576)).toBe('1 MB')
      expect(formatter.bytes(5242880)).toBe('5 MB')
    })

    it('formats GB correctly', () => {
      expect(formatter.bytes(1073741824)).toBe('1 GB')
      expect(formatter.bytes(10737418240)).toBe('10 GB')
    })

    it('formats TB correctly', () => {
      expect(formatter.bytes(1099511627776)).toBe('1 TB')
    })

    it('respects decimal places parameter', () => {
      expect(formatter.bytes(1500, 0)).toBe('1 KB')
      expect(formatter.bytes(1500, 1)).toBe('1.5 KB')
      expect(formatter.bytes(1500, 3)).toBe('1.465 KB')
    })

    it('handles negative decimal places by using 0', () => {
      expect(formatter.bytes(1500, -2)).toBe('1 KB')
    })

    it('handles large numbers correctly', () => {
      expect(formatter.bytes(8589934592)).toBe('8 GB')
      expect(formatter.bytes(1125899906842624)).toBe('1 PB')
    })
  })

  describe('formatFileSize', () => {
    it('formats KB correctly', () => {
      expect(formatter.formatFileSize(1024)).toBe('1 KB')
      expect(formatter.formatFileSize(500 * 1024)).toBe('500 KB')
    })

    it('formats MB correctly', () => {
      expect(formatter.formatFileSize(1024 * 1024)).toBe('1 MB')
      expect(formatter.formatFileSize(50 * 1024 * 1024)).toBe('50 MB')
    })

    it('rounds correctly', () => {
      expect(formatter.formatFileSize(1500)).toBe('1 KB') // 1.46 KB -> 1 KB (toFixed(0))
      expect(formatter.formatFileSize(1.5 * 1024 * 1024)).toBe('2 MB') // 1.5 MB -> 2 MB
    })
  })
})
