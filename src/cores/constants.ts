export class DeviceSelection {
  static readonly NOT_FOUND = -2
}

export const DEFAULT_BACKEND_PORT = 8000
export const DEFAULT_BACKEND_URL = 'http://localhost:8000'

export enum UpscalerType {
  LATENT = 'Latent',
  LATENT_NEAREST = 'Latent (nearest)',
  LATENT_NEAREST_EXACT = 'Latent (nearest-exact)'
}

export enum UpscaleFactor {
  ONE_POINT_FIVE = 1.5,
  TWO = 2,
  THREE = 3,
  FOUR = 4
}
