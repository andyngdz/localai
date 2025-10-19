import { render, screen } from '@testing-library/react'
import { BackendStatusLevel } from '@types'
import { describe, expect, it } from 'vitest'
import type { BackendSetupStatusEntry } from '../../states/useBackendSetupStatusStore'
import { BackendStatusItem } from '../BackendStatusItem'

describe('BackendStatusItem', () => {
  const makeEntry = (
    overrides: Partial<BackendSetupStatusEntry> = {}
  ): BackendSetupStatusEntry => ({
    level: overrides.level ?? BackendStatusLevel.Info,
    message: overrides.message ?? 'backend ready',
    timestamp: overrides.timestamp ?? Date.now(),
    commands: overrides.commands
  })

  it('renders message and timestamp', () => {
    const entry = makeEntry({ message: 'cloning repo' })

    render(<BackendStatusItem status={entry} />)

    expect(screen.getByText('cloning repo')).toBeInTheDocument()
    expect(screen.getByText(/\d{2}:\d{2}/)).toBeInTheDocument()
  })

  it('renders badge color based on level', () => {
    const entry = makeEntry({
      level: BackendStatusLevel.Error,
      message: 'uv failed'
    })

    render(<BackendStatusItem status={entry} />)

    const badge = screen.getByText('uv failed')
    expect(badge).toBeInTheDocument()
  })

  it('renders suggested commands when present', () => {
    const entry = makeEntry({
      commands: [
        {
          label: 'Install uv',
          command: 'curl -LsSf https://astral.sh/uv/install.sh | sh'
        }
      ]
    })

    render(<BackendStatusItem status={entry} />)

    expect(screen.getByText('Suggested commands')).toBeInTheDocument()
    expect(screen.getByText('Install uv')).toBeInTheDocument()
  })
})
