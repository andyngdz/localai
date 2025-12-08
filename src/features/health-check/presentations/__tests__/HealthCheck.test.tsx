import { DeviceSelection } from '@/cores/constants'
import * as queries from '@/cores/api-queries'
import * as hooks from '@/cores/hooks'
import {
  createMockQuery,
  renderWithAct,
  setupRouterMock
} from '@/cores/test-utils'
import { HealthResponse } from '@/types/api'
import { screen } from '@testing-library/react'
import React from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { HealthCheck } from '../HealthCheck'

// Mock the modules
vi.mock('next/navigation', () => ({
  useRouter: vi.fn()
}))

vi.mock('../states/useBackendSetupStatus', () => ({
  useBackendSetupStatus: () => ({ entries: [] })
}))

vi.mock('@/features/setup-layout/presentations/SetupLayout', () => ({
  SetupLayout: ({
    children,
    title,
    description,
    onNext,
    isNextDisabled
  }: {
    children: React.ReactNode
    title: string
    description: string
    onNext?: () => void
    isNextDisabled?: boolean
  }) => (
    <div data-testid="mock-setup-layout">
      <h1>{title}</h1>
      <p>{description}</p>
      <div>{children}</div>
      <button
        data-testid="next-button"
        onClick={onNext}
        disabled={isNextDisabled}
      >
        Next
      </button>
    </div>
  )
}))

vi.mock('../HealthCheckContent', () => ({
  HealthCheckContent: ({
    isHealthy,
    statuses
  }: {
    isHealthy: boolean
    statuses: unknown[]
  }) => (
    <div data-testid="mock-health-check-content">
      {isHealthy ? 'Healthy' : 'Not Healthy'}
      <span data-testid="status-count">{statuses.length}</span>
    </div>
  )
}))

const mockConfigDefaults = {
  upscalers: [],
  upscalerOptions: [],
  safety_check_enabled: true,
  gpu_scale_factor: 0.8,
  ram_scale_factor: 0.8,
  total_gpu_memory: 12485197824,
  total_ram_memory: 32943878144,
  device_index: DeviceSelection.NOT_FOUND
}

describe('HealthCheck', () => {
  let routerMocks: Awaited<ReturnType<typeof setupRouterMock>>

  beforeEach(async () => {
    vi.clearAllMocks()

    // Default mock implementation for useConfig
    vi.spyOn(hooks, 'useConfig').mockReturnValue(mockConfigDefaults)

    routerMocks = await setupRouterMock()
  })

  // Helper to setup health query mock
  const setupHealthQueryMock = (data: HealthResponse | null) => {
    vi.spyOn(queries, 'useHealthQuery').mockReturnValue(createMockQuery(data))
  }

  // Helper to setup config mock with device_index
  const setupConfigMock = (device_index: number) => {
    vi.spyOn(hooks, 'useConfig').mockReturnValue({
      ...mockConfigDefaults,
      device_index
    })
  }

  it('renders with correct title and description', async () => {
    setupHealthQueryMock({
      status: 'ok',
      message: 'Server is running'
    })

    await renderWithAct(<HealthCheck />)

    expect(screen.getByText('Health Check')).toBeInTheDocument()
    expect(
      screen.getByText('Checking the connection to your LocalAI backend server')
    ).toBeInTheDocument()
  })

  it('renders HealthCheckContent with isHealthy=true when backend is healthy', async () => {
    setupHealthQueryMock({
      status: 'ok',
      message: 'Server is running'
    })

    await renderWithAct(<HealthCheck />)

    const content = screen.getByTestId('mock-health-check-content')
    expect(content).toHaveTextContent('Healthy')
  })

  it('renders HealthCheckContent with isHealthy=false when backend is not healthy', async () => {
    setupHealthQueryMock(null)

    await renderWithAct(<HealthCheck />)

    const content = screen.getByTestId('mock-health-check-content')
    expect(content).toHaveTextContent('Not Healthy')
  })

  it('enables the Next button when backend is healthy', async () => {
    setupHealthQueryMock({
      status: 'ok',
      message: 'Server is running'
    })

    await renderWithAct(<HealthCheck />)

    const nextButton = screen.getByTestId('next-button')
    expect(nextButton).not.toBeDisabled()
  })

  it('disables the Next button when backend is not healthy', async () => {
    setupHealthQueryMock(null)

    await renderWithAct(<HealthCheck />)

    const nextButton = screen.getByTestId('next-button')
    expect(nextButton).toBeDisabled()
  })

  it('redirects to editor if device index is already set', async () => {
    setupConfigMock(0)
    setupHealthQueryMock({
      status: 'ok',
      message: 'Server is running'
    })

    const { mockPush } = routerMocks

    await renderWithAct(<HealthCheck />)

    await vi.waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/editor')
    })
  })

  it('does not redirect when backend is not healthy', async () => {
    setupHealthQueryMock(null)

    const { mockPush } = routerMocks

    await renderWithAct(<HealthCheck />)

    await vi.waitFor(() => {
      expect(mockPush).not.toHaveBeenCalled()
    })
  })

  it('redirects to gpu-detection if device index is not set', async () => {
    setupConfigMock(DeviceSelection.NOT_FOUND)
    setupHealthQueryMock({
      status: 'ok',
      message: 'Server is running'
    })

    const { mockPush } = routerMocks

    await renderWithAct(<HealthCheck />)

    await vi.waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/gpu-detection')
    })
  })
})
