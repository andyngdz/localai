import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { GeneralSettings } from '../GeneralSettings'
import { useGeneralSettings } from '../../../states/useGeneralSettings'

vi.mock('../../../states/useGeneralSettings', () => ({
  useGeneralSettings: vi.fn()
}))

vi.mock('@heroui/react', () => ({
  Switch: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
}))

describe('GeneralSettings', () => {
  const mockRegister = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useGeneralSettings).mockReturnValue({
      register: mockRegister
    })
  })

  it('renders safety check switch', () => {
    render(<GeneralSettings />)
    expect(screen.getByText('Safety check')).toBeInTheDocument()
  })

  it('registers safety_check_enabled field', () => {
    render(<GeneralSettings />)
    expect(mockRegister).toHaveBeenCalledWith('safety_check_enabled')
  })
})
