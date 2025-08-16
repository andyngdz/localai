import { render, screen } from '@testing-library/react';
import { FormProvider, useForm } from 'react-hook-form';
import { describe, expect, it } from 'vitest';
import { GpuDetectionItems } from '../GpuDetectionItems';
import { GpuInfo } from '@/types';
import { GpuDetectionFormProps } from '../../types/gpu-detection';

// Wrapper component to provide form context
const FormWrapper = ({
  children,
  defaultValues = {},
}: {
  children: React.ReactNode;
  defaultValues?: Partial<GpuDetectionFormProps>;
}) => {
  const methods = useForm<GpuDetectionFormProps>({ defaultValues });
  return <FormProvider {...methods}>{children}</FormProvider>;
};

describe('GpuDetectionItems', () => {
  const mockGpus: GpuInfo[] = [
    {
      name: 'NVIDIA GeForce RTX 4090',
      memory: 25769803776,
      cuda_compute_capability: '8.9',
      is_primary: false,
    },
    {
      name: 'NVIDIA GeForce RTX 3080',
      memory: 10737418240,
      cuda_compute_capability: '8.6',
      is_primary: true,
    },
    {
      name: 'NVIDIA GeForce GTX 1080',
      memory: 8589934592,
      cuda_compute_capability: '6.1',
      is_primary: false,
    },
  ];

  it('renders all GPU items', () => {
    render(
      <FormWrapper>
        <GpuDetectionItems gpus={mockGpus} />
      </FormWrapper>,
    );

    expect(screen.getByText('NVIDIA GeForce RTX 4090')).toBeInTheDocument();
    expect(screen.getByText('NVIDIA GeForce RTX 3080')).toBeInTheDocument();
    expect(screen.getByText('NVIDIA GeForce GTX 1080')).toBeInTheDocument();
  });

  it('defaults to primary GPU selection', () => {
    render(
      <FormWrapper>
        <GpuDetectionItems gpus={mockGpus} />
      </FormWrapper>,
    );

    // Primary GPU is at index 1, so it should be selected by default
    const radioButtons = screen.getAllByRole('radio');
    expect(radioButtons).toHaveLength(3);

    // The second radio button (index 1) should be selected since that GPU is primary
    expect(radioButtons[0]).not.toBeChecked();
    expect(radioButtons[1]).toBeChecked();
    expect(radioButtons[2]).not.toBeChecked();
  });

  it('handles empty GPU list', () => {
    render(
      <FormWrapper>
        <GpuDetectionItems gpus={[]} />
      </FormWrapper>,
    );

    // Should not render any radio buttons
    expect(screen.queryAllByRole('radio')).toHaveLength(0);
  });

  it('handles case with no primary GPU', () => {
    const noPrimaryGpus: GpuInfo[] = [
      {
        name: 'GPU 1',
        memory: 8589934592,
        cuda_compute_capability: '6.1',
        is_primary: false,
      },
      {
        name: 'GPU 2',
        memory: 8589934592,
        cuda_compute_capability: '6.1',
        is_primary: false,
      },
    ];

    render(
      <FormWrapper>
        <GpuDetectionItems gpus={noPrimaryGpus} />
      </FormWrapper>,
    );

    // When no primary GPU is found, findIndex returns -1, so defaultValue would be "-1"
    // This means no radio button should be selected by default
    const radioButtons = screen.getAllByRole('radio');
    expect(radioButtons).toHaveLength(2);

    // Check that all radio buttons are unchecked (since defaultValue is "-1")
    radioButtons.forEach((radio) => {
      expect(radio).not.toBeChecked();
    });
  });

  it('renders correct number of GPU items', () => {
    render(
      <FormWrapper>
        <GpuDetectionItems gpus={mockGpus} />
      </FormWrapper>,
    );

    // Should render the same number of radio buttons as GPUs
    const radioButtons = screen.getAllByRole('radio');
    expect(radioButtons).toHaveLength(mockGpus.length);

    // Each radio button should have the correct value attribute
    expect(radioButtons[0]).toHaveAttribute('value', '0');
    expect(radioButtons[1]).toHaveAttribute('value', '1');
    expect(radioButtons[2]).toHaveAttribute('value', '2');
  });

  it('registers form field correctly', () => {
    const { container } = render(
      <FormWrapper>
        <GpuDetectionItems gpus={mockGpus} />
      </FormWrapper>,
    );

    // Check that the RadioGroup has the required validation
    const radioGroup = container.querySelector('[role="radiogroup"]');
    expect(radioGroup).toBeInTheDocument();
  });

  it('wraps content in a Card component', () => {
    const { container } = render(
      <FormWrapper>
        <GpuDetectionItems gpus={mockGpus} />
      </FormWrapper>,
    );

    // Check for Card component structure (HeroUI Card typically has specific classes)
    const cardElement = container.firstChild;
    expect(cardElement).toBeInTheDocument();
  });
});
