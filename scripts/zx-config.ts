import { $, usePowerShell } from 'zx'

// Configure shell for Windows
if (process.platform === 'win32') {
  /**
   * This is not a hook
   * Just a function call to configure zx to use PowerShell on Windows
   */
  // eslint-disable-next-line react-hooks/rules-of-hooks
  usePowerShell()
}

// Export the configured $ instance
export { $ }
export * from 'zx'
