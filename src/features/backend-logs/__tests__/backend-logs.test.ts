import { describe, expect, it } from 'vitest'
import { backendLogsService } from '../services'

describe('BackendLogsService', () => {
  describe('onGetLogColor', () => {
    it('should return "text-danger" for "error" level', () => {
      expect(backendLogsService.onGetLogColor('error')).toBe('text-danger')
    })

    it('should return "text-warning" for "warn" level', () => {
      expect(backendLogsService.onGetLogColor('warn')).toBe('text-warning')
    })

    it('should return "text-default-500" for "info" level', () => {
      expect(backendLogsService.onGetLogColor('info')).toBe('text-default-500')
    })

    it('should return "text-default-500" for "log" level', () => {
      expect(backendLogsService.onGetLogColor('log')).toBe('text-default-500')
    })

    it('should return "text-default-500" for unknown levels', () => {
      expect(backendLogsService.onGetLogColor('unknown')).toBe(
        'text-default-500'
      )
    })

    it('should return "text-default-500" for any other level', () => {
      expect(backendLogsService.onGetLogColor('debug')).toBe('text-default-500')
    })
  })

  describe('onGetBorderColor', () => {
    it('should return "bg-danger" for "error" level', () => {
      expect(backendLogsService.onGetBorderColor('error')).toBe('bg-danger')
    })

    it('should return "bg-warning" for "warn" level', () => {
      expect(backendLogsService.onGetBorderColor('warn')).toBe('bg-warning')
    })

    it('should return "bg-success" for "info" level', () => {
      expect(backendLogsService.onGetBorderColor('info')).toBe('bg-success')
    })

    it('should return "bg-success" for "log" level', () => {
      expect(backendLogsService.onGetBorderColor('log')).toBe('bg-success')
    })

    it('should return "bg-success" for unknown levels', () => {
      expect(backendLogsService.onGetBorderColor('unknown')).toBe('bg-success')
    })

    it('should return "bg-success" for any other level', () => {
      expect(backendLogsService.onGetBorderColor('debug')).toBe('bg-success')
    })
  })
})
