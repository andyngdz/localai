declare global {
  interface Window {
    electronAPI: {
      downloadImage: (url: string) => Promise<void>
    }
  }
}

export {}
