import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { GeneratorConfigStyleSearchInput } from '../GeneratorConfigStyleSearchInput'

vi.mock('lucide-react', () => ({
  Search: ({ size }: { size: number }) => (
    <svg data-testid="search-icon" width={size} height={size}>
      <title>Search</title>
    </svg>
  )
}))

describe('GeneratorConfigStyleSearchInput', () => {
  it('renders search input with placeholder', () => {
    render(
      <GeneratorConfigStyleSearchInput
        value=""
        onChange={vi.fn()}
        onClear={vi.fn()}
      />
    )

    expect(
      screen.getByPlaceholderText(
        'Search styles by name, category, or keywords...'
      )
    ).toBeInTheDocument()
  })

  it('displays search icon', () => {
    const { container } = render(
      <GeneratorConfigStyleSearchInput
        value=""
        onChange={vi.fn()}
        onClear={vi.fn()}
      />
    )

    const searchIcon = container.querySelector('svg')
    expect(searchIcon).toBeInTheDocument()
  })

  it('displays current value', () => {
    render(
      <GeneratorConfigStyleSearchInput
        value="portrait"
        onChange={vi.fn()}
        onClear={vi.fn()}
      />
    )

    const input = screen.getByDisplayValue('portrait')
    expect(input).toBeInTheDocument()
  })

  it('calls onChange when user types', async () => {
    const user = userEvent.setup()
    const handleChange = vi.fn()

    render(
      <GeneratorConfigStyleSearchInput
        value=""
        onChange={handleChange}
        onClear={vi.fn()}
      />
    )

    const input = screen.getByPlaceholderText(
      'Search styles by name, category, or keywords...'
    )
    await user.type(input, 'anime')

    expect(handleChange).toHaveBeenCalled()
    expect(handleChange).toHaveBeenLastCalledWith('anime')
  })

  it('shows clear button when value is not empty', () => {
    const { container } = render(
      <GeneratorConfigStyleSearchInput
        value="portrait"
        onChange={vi.fn()}
        onClear={vi.fn()}
      />
    )

    const clearButton = container.querySelector('button[aria-label="clear"]')
    expect(clearButton).toBeInTheDocument()
  })

  it('hides clear button when value is empty', () => {
    const { container } = render(
      <GeneratorConfigStyleSearchInput
        value=""
        onChange={vi.fn()}
        onClear={vi.fn()}
      />
    )

    const clearButton = container.querySelector('button[aria-label="clear"]')
    expect(clearButton).not.toBeInTheDocument()
  })

  it('calls onClear when clear button is clicked', async () => {
    const user = userEvent.setup()
    const handleClear = vi.fn()

    const { container } = render(
      <GeneratorConfigStyleSearchInput
        value="portrait"
        onChange={vi.fn()}
        onClear={handleClear}
      />
    )

    const clearButton = container.querySelector('button[aria-label="clear"]')
    expect(clearButton).toBeInTheDocument()

    if (clearButton) {
      await user.click(clearButton)
      expect(handleClear).toHaveBeenCalledOnce()
    }
  })

  it('has bordered variant styling', () => {
    const { container } = render(
      <GeneratorConfigStyleSearchInput
        value=""
        onChange={vi.fn()}
        onClear={vi.fn()}
      />
    )

    const inputWrapper = container.querySelector('[data-slot="input-wrapper"]')
    expect(inputWrapper).toBeInTheDocument()
  })
})
