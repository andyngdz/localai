import { describe, expect, it } from 'vitest'
import { backendLogsService } from '../services'

describe('BackendLogsService', () => {
  it('should return "text-danger" for "error" level', () => {
    expect(backendLogsService.onGetLogColor('error')).toBe('text-danger')
  })

  it('should return "text-warning" for "warn" level', () => {
    expect(backendLogsService.onGetLogColor('warn')).toBe('text-warning')
  })

  it('should return "text-success" for "info" level', () => {
    expect(backendLogsService.onGetLogColor('info')).toBe('text-success')
  })

  it('should return "text-success" for "log" level', () => {
    expect(backendLogsService.onGetLogColor('log')).toBe('text-success')
  })

  it('should return "text-success" for unknown levels', () => {
    expect(backendLogsService.onGetLogColor('unknown')).toBe('text-success')
  })

  it('should return "text-success" for any other level', () => {
    expect(backendLogsService.onGetLogColor('debug')).toBe('text-success')
  })
})
