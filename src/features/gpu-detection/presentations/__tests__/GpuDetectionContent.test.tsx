import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { GpuDetectionContent } from '../GpuDetectionContent';
import { HardwareResponse, GpuInfo } from '@/types';

// Mock child components
vi.mock('../GpuDetectionCpuModeOnly', () => ({
  GpuDetectionCpuModeOnly: () => <div data-testid="cpu-mode-only">CPU Mode Only Component</div>,
}));

vi.mock('../GpuDetectionItems', () => ({
  GpuDetectionItems: ({ gpus }: { gpus: GpuInfo[] }) => (
    <div data-testid="gpu-items">GPU Items: {gpus.length} GPUs</div>
  ),
}));

vi.mock('../GpuDetectionVersion', () => ({
  GpuDetectionVersion: ({
    cuda_runtime_version,
    nvidia_driver_version,
  }: {
    cuda_runtime_version: string;
    nvidia_driver_version: string;
  }) => (
    <div data-testid="gpu-version">
      CUDA: {cuda_runtime_version}, Driver: {nvidia_driver_version}
    </div>
  ),
}));

describe('GpuDetectionContent', () => {
  const mockGpus: GpuInfo[] = [
    {
      name: 'NVIDIA GeForce RTX 4090',
      memory: 25769803776,
      cuda_compute_capability: '8.9',
      is_primary: true,
    },
  ];

  const mockHardwareDataWithCuda: HardwareResponse = {
    is_cuda: true,
    cuda_runtime_version: '12.2',
    nvidia_driver_version: '535.104.05',
    gpus: mockGpus,
    message: 'Hardware detected successfully',
  };

  const mockHardwareDataWithoutCuda: HardwareResponse = {
    is_cuda: false,
    cuda_runtime_version: '',
    nvidia_driver_version: '',
    gpus: [],
    message: 'No CUDA support detected',
  };

  it('renders GPU version when CUDA is available', () => {
    render(<GpuDetectionContent hardwareData={mockHardwareDataWithCuda} />);

    expect(screen.getByTestId('gpu-version')).toBeInTheDocument();
    expect(screen.getByText('CUDA: 12.2, Driver: 535.104.05')).toBeInTheDocument();
  });

  it('does not render GPU version when CUDA is not available', () => {
    render(<GpuDetectionContent hardwareData={mockHardwareDataWithoutCuda} />);

    expect(screen.queryByTestId('gpu-version')).not.toBeInTheDocument();
  });

  it('always renders GPU items', () => {
    render(<GpuDetectionContent hardwareData={mockHardwareDataWithCuda} />);

    expect(screen.getByTestId('gpu-items')).toBeInTheDocument();
    expect(screen.getByText('GPU Items: 1 GPUs')).toBeInTheDocument();
  });

  it('renders CPU mode only when CUDA is not available', () => {
    render(<GpuDetectionContent hardwareData={mockHardwareDataWithoutCuda} />);

    expect(screen.getByTestId('cpu-mode-only')).toBeInTheDocument();
    expect(screen.getByText('CPU Mode Only Component')).toBeInTheDocument();
  });

  it('does not render CPU mode only when CUDA is available', () => {
    render(<GpuDetectionContent hardwareData={mockHardwareDataWithCuda} />);

    expect(screen.queryByTestId('cpu-mode-only')).not.toBeInTheDocument();
  });

  it('renders with proper structure and styling', () => {
    const { container } = render(<GpuDetectionContent hardwareData={mockHardwareDataWithCuda} />);

    const mainDiv = container.firstChild as HTMLElement;
    expect(mainDiv).toHaveClass('flex', 'flex-col', 'gap-4');
  });

  it('handles empty GPU list', () => {
    const dataWithEmptyGpus: HardwareResponse = {
      ...mockHardwareDataWithCuda,
      gpus: [],
    };

    render(<GpuDetectionContent hardwareData={dataWithEmptyGpus} />);

    expect(screen.getByText('GPU Items: 0 GPUs')).toBeInTheDocument();
  });

  it('renders all components in correct order when CUDA is available', () => {
    const { container } = render(<GpuDetectionContent hardwareData={mockHardwareDataWithCuda} />);

    const mainDiv = container.firstChild as HTMLElement;
    const children = Array.from(mainDiv.children);

    // Should have GPU version first, then GPU items
    expect(children[0]).toHaveAttribute('data-testid', 'gpu-version');
    expect(children[1]).toHaveAttribute('data-testid', 'gpu-items');
    expect(children.length).toBe(2); // No CPU mode only
  });

  it('renders all components in correct order when CUDA is not available', () => {
    const { container } = render(
      <GpuDetectionContent hardwareData={mockHardwareDataWithoutCuda} />,
    );

    const mainDiv = container.firstChild as HTMLElement;
    const children = Array.from(mainDiv.children);

    // Should have GPU items first, then CPU mode only
    expect(children[0]).toHaveAttribute('data-testid', 'gpu-items');
    expect(children[1]).toHaveAttribute('data-testid', 'cpu-mode-only');
    expect(children.length).toBe(2); // No GPU version
  });
});
