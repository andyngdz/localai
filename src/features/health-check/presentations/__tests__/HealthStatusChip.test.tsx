import { render, screen } from '@testing-library/react'
import { BackendStatusLevel } from '@types'
import { describe, expect, it } from 'vitest'
import type { BackendSetupStatusEntry } from '../../states/useBackendSetupStatusStore'
import { HealthStatusChip } from '../HealthStatusChip'

describe('HealthStatusChip', () => {
  const makeEntry = (
    overrides: Partial<BackendSetupStatusEntry> = {}
  ): BackendSetupStatusEntry => ({
    id: overrides.id ?? 'test-id',
    level: overrides.level ?? BackendStatusLevel.Info,
    message: overrides.message ?? 'backend ready',
    timestamp: overrides.timestamp ?? Date.now(),
    commands: overrides.commands
  })

  it('shows success message when backend is healthy', () => {
    render(<HealthStatusChip isHealthy={true} latestStatus={makeEntry()} />)

    expect(screen.getByText('Backend is running')).toBeInTheDocument()
  })

  it('shows latest status when backend is unhealthy but status exists', () => {
    const status = makeEntry({
      level: BackendStatusLevel.Error,
      message: 'uv installation failed'
    })

    render(<HealthStatusChip isHealthy={false} latestStatus={status} />)

    expect(screen.getByText('uv installation failed')).toBeInTheDocument()
  })

  it('shows waiting message when no status yet', () => {
    render(<HealthStatusChip isHealthy={false} latestStatus={undefined} />)

    expect(screen.getByText('Waiting for backend')).toBeInTheDocument()
  })
})
