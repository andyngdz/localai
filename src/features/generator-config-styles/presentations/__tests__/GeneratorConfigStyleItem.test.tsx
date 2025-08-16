import { GeneratorConfigFormValues } from '@/features/generator-configs/types/generator-config';
import { fireEvent, render, screen } from '@testing-library/react';
import { FormProvider, useForm } from 'react-hook-form';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { GeneratorConfigStyleItem } from '../GeneratorConfigStyleItem';

// Mock the style item data
const mockStyleItem = {
  id: 'test-style-id',
  name: 'Test Style',
  origin: 'Test Origin',
  license: 'MIT',
  positive: 'A test style description',
  image: 'test-style.jpg',
};

// Test wrapper component that provides form context
const TestWrapper = ({
  children,
  defaultValues,
}: {
  children: React.ReactNode;
  defaultValues?: Partial<GeneratorConfigFormValues>;
}) => {
  const methods = useForm<GeneratorConfigFormValues>({
    defaultValues: {
      width: 512,
      height: 512,
      hires_fix: false,
      number_of_images: 4,
      steps: 24,
      seed: -1,
      cfg_scale: 7.5,
      styles: [],
      ...defaultValues,
    },
  });

  return <FormProvider {...methods}>{children}</FormProvider>;
};

describe('GeneratorConfigStyleItem', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders style item information', () => {
    render(
      <TestWrapper>
        <GeneratorConfigStyleItem styleItem={mockStyleItem} />
      </TestWrapper>,
    );

    expect(screen.getByText('Test Style')).toBeInTheDocument();
  });

  it('shows as not selected when style is not in the form', () => {
    render(
      <TestWrapper>
        <GeneratorConfigStyleItem styleItem={mockStyleItem} />
      </TestWrapper>,
    );

    const chip = screen.getByText('Test Style').closest('div');
    expect(chip).not.toHaveClass('border-primary');
  });

  it('shows as selected when style is in the form', () => {
    render(
      <TestWrapper defaultValues={{ styles: ['test-style-id'] }}>
        <GeneratorConfigStyleItem styleItem={mockStyleItem} />
      </TestWrapper>,
    );

    const chip = screen.getByText('Test Style').closest('div');
    expect(chip).toHaveClass('border-primary');
  });

  it('adds style to selection when clicked and not selected', () => {
    render(
      <TestWrapper>
        <GeneratorConfigStyleItem styleItem={mockStyleItem} />
      </TestWrapper>,
    );

    const chip = screen.getByText('Test Style').closest('div');
    fireEvent.click(chip!);

    // The chip should now have the selected styling
    expect(chip).toHaveClass('border-primary');
  });

  it('removes style from selection when clicked and already selected', () => {
    render(
      <TestWrapper defaultValues={{ styles: ['test-style-id'] }}>
        <GeneratorConfigStyleItem styleItem={mockStyleItem} />
      </TestWrapper>,
    );

    const chip = screen.getByText('Test Style').closest('div');
    fireEvent.click(chip!);

    // The chip should no longer have the selected styling
    expect(chip).not.toHaveClass('border-primary');
  });

  it('handles multiple styles in selection correctly', () => {
    render(
      <TestWrapper defaultValues={{ styles: ['other-style', 'test-style-id', 'another-style'] }}>
        <GeneratorConfigStyleItem styleItem={mockStyleItem} />
      </TestWrapper>,
    );

    const chip = screen.getByText('Test Style').closest('div');
    expect(chip).toHaveClass('border-primary');
  });
});
