import { NumberInput } from '@heroui/react';
import { render, screen } from '@testing-library/react';
import { Control, FieldValues, useController } from 'react-hook-form';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NumberInputController } from '../NumberInputController';

// Mock the HeroUI NumberInput component
vi.mock('@heroui/react', () => ({
  NumberInput: vi.fn(() => <div data-testid="number-input" />),
}));

// Mock React Hook Form
vi.mock('react-hook-form', () => ({
  useController: vi.fn(() => ({
    field: {
      value: 10,
      onChange: vi.fn(),
      onBlur: vi.fn(),
      name: 'testNumber',
      ref: vi.fn(),
    },
    fieldState: {
      error: undefined,
      invalid: false,
      isTouched: false,
      isDirty: false,
      isValidating: false,
    },
    formState: {
      errors: {},
      isDirty: false,
      dirtyFields: {},
      touchedFields: {},
      isSubmitted: false,
      isSubmitting: false,
      isSubmitSuccessful: false,
      isValidating: false,
      isValid: true,
    },
  })),
  useForm: vi.fn(),
}));

describe('NumberInputController', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the NumberInput component', () => {
    const control = {} as Control<FieldValues>;

    render(
      <NumberInputController
        control={control}
        controlName="testNumber"
        minValue={5}
        maximumFractionDigits={2}
      />,
    );

    expect(screen.getByTestId('number-input')).toBeInTheDocument();
    expect(NumberInput).toHaveBeenCalled();
  });

  it('passes correct props to NumberInput', () => {
    const control = {} as Control<FieldValues>;

    render(
      <NumberInputController
        control={control}
        controlName="testNumber"
        minValue={5}
        maximumFractionDigits={2}
      />,
    );

    // Verify that NumberInput was called with hideStepper prop
    expect(vi.mocked(NumberInput).mock.calls[0][0]).toMatchObject({
      hideStepper: true,
      minValue: 5,
      formatOptions: {
        useGrouping: false,
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      },
    });
  });

  it('uses default maximumFractionDigits value when not provided', () => {
    const control = {} as Control<FieldValues>;

    render(<NumberInputController control={control} controlName="testNumber" />);

    // Verify the default maximumFractionDigits value
    expect(vi.mocked(NumberInput).mock.calls[0][0].formatOptions).toMatchObject({
      maximumFractionDigits: 0,
    });
  });

  it('passes error state when field has errors', () => {
    // Mock the useController hook to return an error state
    vi.mocked(useController).mockReturnValueOnce({
      field: {
        value: 10,
        onChange: vi.fn(),
        onBlur: vi.fn(),
        name: 'testNumber',
        ref: vi.fn(),
      },
      fieldState: {
        error: { type: 'validate', message: 'Input is required' },
        invalid: true,
        isTouched: true,
        isDirty: false,
        isValidating: false,
      },
      formState: {
        errors: { testNumber: { type: 'validate', message: 'Input is required' } },
        isDirty: false,
        dirtyFields: {},
        touchedFields: { testNumber: true },
        isSubmitted: false,
        isSubmitting: false,
        isSubmitSuccessful: false,
        isValidating: false,
        isValid: false,
        isLoading: false,
        disabled: false,
        submitCount: 0,
        validatingFields: {},
        isReady: true,
      },
    });

    const control = {} as Control<FieldValues>;

    render(<NumberInputController control={control} controlName="testNumber" />);

    // Verify error props
    const props = vi.mocked(NumberInput).mock.calls[0][0];
    expect(props.errorMessage).toBe('Input is required');
    expect(props.isInvalid).toBe(true);
  });
});
