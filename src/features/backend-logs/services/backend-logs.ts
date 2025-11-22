class BackendLogsService {
  onGetLogColor = (level: string) => {
    switch (level) {
      case 'error':
        return 'text-danger'
      case 'warn':
        return 'text-warning'
      case 'info':
      case 'log':
      default:
        return 'text-default-500'
    }
  }

  onGetBorderColor(level: string) {
    switch (level) {
      case 'error':
        return 'border-l-danger'
      case 'warn':
        return 'border-l-warning'
      case 'info':
      case 'log':
      default:
        return 'border-l-success'
    }
  }
}

export const backendLogsService = new BackendLogsService()
