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
        return 'text-success'
    }
  }
}

export const backendLogsService = new BackendLogsService()
