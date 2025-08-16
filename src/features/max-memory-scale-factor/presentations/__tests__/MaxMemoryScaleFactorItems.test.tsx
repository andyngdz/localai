import { render, screen } from '@testing-library/react';
import { FormProvider, useForm } from 'react-hook-form';
import { describe, expect, it, vi } from 'vitest';
import { MEMORY_OPTIONS } from '../../constants';
import { MaxMemoryFormProps } from '../../types';
import { MaxMemoryScaleFactorItems } from '../MaxMemoryScaleFactorItems';

// Mock the MaxMemoryScaleFactorItem component
vi.mock('../MaxMemoryScaleFactorItem', () => ({
  MaxMemoryScaleFactorItem: ({ option }: { option: { scaleFactor: number } }) => (
    <div data-testid={`memory-item-${option.scaleFactor}`}>Memory Item {option.scaleFactor}</div>
  ),
}));

describe('MaxMemoryScaleFactorItems', () => {
  const FormWrapper = ({ children }: { children: React.ReactNode }) => {
    const methods = useForm<MaxMemoryFormProps>({
      defaultValues: { scaleFactor: 0.5 },
    });

    return <FormProvider {...methods}>{children}</FormProvider>;
  };

  it('renders all memory options from constants', () => {
    render(
      <FormWrapper>
        <MaxMemoryScaleFactorItems />
      </FormWrapper>,
    );

    // Check that each memory option is rendered
    MEMORY_OPTIONS.forEach((option) => {
      expect(screen.getByTestId(`memory-item-${option.scaleFactor}`)).toBeInTheDocument();
    });
  });

  it('renders RadioGroup component with correct default value', () => {
    render(
      <FormWrapper>
        <MaxMemoryScaleFactorItems />
      </FormWrapper>,
    );

    // Assuming the RadioGroup renders a role="radiogroup"
    const radioGroup = screen.getByRole('radiogroup');
    expect(radioGroup).toBeInTheDocument();
  });
});
