import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { AppLayout } from '../app-layout'

vi.mock('@/features/app-footer', () => ({
  AppFooter: () => <div data-testid="app-footer" />
}))

vi.mock('@/cores/backend-initialization', () => ({
  initializeBackend: vi.fn()
}))

describe('AppLayout', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders children and footer', () => {
    render(
      <AppLayout>
        <div data-testid="test-content">Test Content</div>
      </AppLayout>
    )

    expect(screen.getByTestId('test-content')).toBeInTheDocument()
    expect(screen.getByTestId('app-footer')).toBeInTheDocument()
  })

  it('calls initializeBackend on mount', async () => {
    const { initializeBackend } = await import('@/cores/backend-initialization')

    render(
      <AppLayout>
        <div>Test</div>
      </AppLayout>
    )

    expect(initializeBackend).toHaveBeenCalledTimes(1)
  })
})
