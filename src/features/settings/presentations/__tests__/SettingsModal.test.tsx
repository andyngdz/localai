import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { SettingsModal } from '../SettingsModal'

vi.mock('@heroui/react', () => ({
  Modal: ({
    isOpen,
    children
  }: {
    isOpen: boolean
    children: React.ReactNode
  }) => (isOpen ? <div data-testid="modal">{children}</div> : null),
  ModalContent: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="modal-content">{children}</div>
  ),
  ModalHeader: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="modal-header">{children}</div>
  ),
  ModalBody: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="modal-body">{children}</div>
  ),
  Divider: () => <hr data-testid="divider" />,
  Tabs: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="tabs">{children}</div>
  ),
  Tab: ({ title, children }: { title: string; children: React.ReactNode }) => (
    <section>
      <h3>{title}</h3>
      <div>{children}</div>
    </section>
  )
}))

vi.mock('../tabs', () => ({
  GeneralSettings: () => (
    <div data-testid="general-settings">General settings content</div>
  ),
  ModelManagement: () => (
    <div data-testid="model-management">Model management content</div>
  ),
  UpdateSettings: () => (
    <div data-testid="update-settings">Update settings content</div>
  )
}))

describe('SettingsModal', () => {
  it('renders the modal with all tabs when open', () => {
    render(<SettingsModal isOpen onClose={vi.fn()} />)

    expect(screen.getByTestId('modal')).toBeInTheDocument()
    expect(screen.getByText('Settings')).toBeInTheDocument()
    expect(screen.getByText('General')).toBeInTheDocument()
    expect(screen.getByText('Model Management')).toBeInTheDocument()
    expect(screen.getByText('Updates')).toBeInTheDocument()
    expect(screen.getByTestId('general-settings')).toBeInTheDocument()
    expect(screen.getByTestId('model-management')).toBeInTheDocument()
    expect(screen.getByTestId('update-settings')).toBeInTheDocument()
  })

  it('does not render the modal content when closed', () => {
    render(<SettingsModal isOpen={false} onClose={vi.fn()} />)

    expect(screen.queryByTestId('modal')).not.toBeInTheDocument()
  })
})
