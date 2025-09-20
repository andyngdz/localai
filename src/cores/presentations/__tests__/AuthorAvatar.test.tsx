/**
 * @file Tests for the AuthorAvatar component
 *
 * Tests that the AuthorAvatar component:
 * - Renders with the correct avatar URL based on the provided ID
 * - Passes through additional props to the Avatar component
 * - Maintains proper typing with AvatarProps
 */

import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { AuthorAvatar, AuthorAvatarProps } from '../AuthorAvatar'

// Mock the Avatar component
vi.mock('@heroui/react', () => ({
  Avatar: vi.fn(({ src, ...props }) => (
    <div
      data-testid="mock-avatar"
      data-src={src}
      data-props={JSON.stringify(props)}
    >
      Mock Avatar
    </div>
  ))
}))

describe('AuthorAvatar', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders with the correct avatar URL based on the provided ID', () => {
    // Arrange
    const authorId = 'test-author-123'
    const expectedUrl = `http://localhost:8000/users/avatar/${authorId}.png`

    // Act
    render(<AuthorAvatar id={authorId} />)
    const avatarElement = screen.getByTestId('mock-avatar')

    // Assert
    expect(avatarElement).toBeInTheDocument()
    expect(avatarElement.getAttribute('data-src')).toBe(expectedUrl)
  })

  it('passes additional props to the Avatar component', () => {
    // Arrange
    const testProps: AuthorAvatarProps = {
      id: 'test-author',
      className: 'custom-avatar',
      alt: 'Author Profile Picture',
      size: 'lg'
    }

    // Act
    render(<AuthorAvatar {...testProps} />)
    const avatarElement = screen.getByTestId('mock-avatar')

    // Assert
    const passedProps = JSON.parse(
      avatarElement.getAttribute('data-props') || '{}'
    )
    expect(passedProps.className).toBe('custom-avatar')
    expect(passedProps.alt).toBe('Author Profile Picture')
    expect(passedProps.size).toBe('lg')
  })

  it('handles empty ID gracefully', () => {
    // Arrange
    const emptyId = ''
    const expectedUrl = `http://localhost:8000/users/avatar/${emptyId}.png`

    // Act
    render(<AuthorAvatar id={emptyId} />)
    const avatarElement = screen.getByTestId('mock-avatar')

    // Assert
    expect(avatarElement).toBeInTheDocument()
    expect(avatarElement.getAttribute('data-src')).toBe(expectedUrl)
  })
})
