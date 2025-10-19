import { render, screen } from '@testing-library/react'
import { BackendStatusLevel } from '@types'
import { describe, expect, it } from 'vitest'
import type { BackendSetupStatusEntry } from '../../states/useBackendSetupStatusStore'
import { BackendStatusList } from '../BackendStatusList'

describe('BackendStatusList', () => {
  const makeEntry = (
    overrides: Partial<BackendSetupStatusEntry> = {}
  ): BackendSetupStatusEntry => ({
    level: overrides.level ?? BackendStatusLevel.Info,
    message: overrides.message ?? 'backend ready',
    timestamp: overrides.timestamp ?? Date.now(),
    commands: overrides.commands
  })

  it('renders waiting state when no statuses', () => {
    render(<BackendStatusList statuses={[]} />)

    expect(
      screen.getByText('Waiting for backend status...')
    ).toBeInTheDocument()
  })

  it('renders entries as listbox items', () => {
    const statuses = [
      makeEntry({ message: 'cloning repo', timestamp: Date.now() }),
      makeEntry({
        message: 'installing dependencies',
        timestamp: Date.now() + 1
      })
    ]

    render(<BackendStatusList statuses={statuses} />)

    expect(screen.getByText('cloning repo')).toBeInTheDocument()
    expect(screen.getByText('installing dependencies')).toBeInTheDocument()
  })

  it('shows command suggestions when present', () => {
    const statuses = [
      makeEntry({
        message: 'uv install failed',
        commands: [
          {
            label: 'Install uv',
            command: 'curl -LsSf https://astral.sh/uv/install.sh | sh'
          }
        ]
      })
    ]

    render(<BackendStatusList statuses={statuses} />)

    expect(screen.getByText('Suggested commands')).toBeInTheDocument()
    expect(screen.getByText('Install uv')).toBeInTheDocument()
  })
})
