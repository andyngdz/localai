export class DeviceSelection {
  static readonly NOT_FOUND = -2
}

export const DEFAULT_BACKEND_PORT = 8000
export const DEFAULT_BACKEND_URL = 'http://localhost:8000'

export enum UpscalerType {
  LANCZOS = 'Lanczos',
  BICUBIC = 'Bicubic',
  BILINEAR = 'Bilinear',
  NEAREST = 'Nearest'
}

export enum UpscaleFactor {
  ONE_POINT_FIVE = 1.5,
  TWO = 2,
  THREE = 3,
  FOUR = 4
}
