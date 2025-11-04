import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { SettingsModal } from '../SettingsModal'
import { SettingsTab } from '../../states/useSettingsStore'

const mockSetSelectedTab = vi.fn()
let mockSelectedTab: SettingsTab = 'general'

vi.mock('../../states/useSettingsStore', () => ({
  useSettingsStore: () => ({
    selectedTab: mockSelectedTab,
    setSelectedTab: mockSetSelectedTab
  })
}))

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
  Tabs: ({
    children,
    selectedKey,
    onSelectionChange
  }: {
    children: React.ReactNode
    selectedKey?: string
    onSelectionChange?: (key: string) => void
  }) => (
    <div data-testid="tabs" data-selected-key={selectedKey}>
      {children}
      <button
        data-testid="change-tab-models"
        onClick={() => onSelectionChange?.('models')}
      >
        Change to models
      </button>
    </div>
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
  beforeEach(() => {
    mockSelectedTab = 'general'
    vi.clearAllMocks()
  })

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

  it('displays the selected tab from store', () => {
    render(<SettingsModal isOpen onClose={vi.fn()} />)

    const tabs = screen.getByTestId('tabs')
    expect(tabs).toHaveAttribute('data-selected-key', 'general')
  })

  it('calls setSelectedTab when tab selection changes', () => {
    render(<SettingsModal isOpen onClose={vi.fn()} />)

    const changeButton = screen.getByTestId('change-tab-models')
    changeButton.click()

    expect(mockSetSelectedTab).toHaveBeenCalledWith('models')
  })
})
