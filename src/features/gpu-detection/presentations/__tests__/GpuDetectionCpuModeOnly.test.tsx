import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { GpuDetectionCpuModeOnly } from '../GpuDetectionCpuModeOnly';

describe('GpuDetectionCpuModeOnly', () => {
  it('renders CPU mode message', () => {
    render(<GpuDetectionCpuModeOnly />);

    expect(screen.getByText('CPU Mode Only')).toBeInTheDocument();
    expect(screen.getByText(/LocalAI will run on CPU/)).toBeInTheDocument();
    expect(screen.getByText(/Consider installing CUDA drivers/)).toBeInTheDocument();
  });

  it('has correct structure and classes', () => {
    const { container } = render(<GpuDetectionCpuModeOnly />);

    const mainDiv = container.firstChild as HTMLElement;
    expect(mainDiv).toHaveClass('rounded-md');

    const title = screen.getByText('CPU Mode Only');
    expect(title).toHaveClass('text-sm', 'font-medium');

    const description = screen.getByText(/LocalAI will run on CPU/);
    expect(description.parentElement).toHaveClass('mt-2', 'text-sm');
  });
});
