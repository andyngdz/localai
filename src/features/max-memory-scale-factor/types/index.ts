import { RadioProps } from '@heroui/react';

export interface MemoryOption {
  scaleFactor: number;
  label: string;
}

export interface MaxMemoryFormProps {
  scaleFactor: number;
}

export interface MemoryColorClasses {
  bgClassName: string;
  textClassName: string;
  color: RadioProps['color'];
}
