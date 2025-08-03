export interface MaxMemoryConfig {
  ram_scale_factor: number;
  gpu_scale_factor: number;
}

export interface MemoryResponse {
  ram: number;
  gpu: number;
}

export interface MemoryOption {
  value: number;
  label: string;
}

export interface MaxMemoryProps {
  onNext?: (config: MaxMemoryConfig) => void;
  onBack?: () => void;
}

export interface MemoryOptionItemProps {
  option: MemoryOption;
  isSelected: boolean;
  onSelect: () => void;
}

export interface MemoryPreviewProps {
  selectedValue?: number;
  totalMemory?: number;
}
