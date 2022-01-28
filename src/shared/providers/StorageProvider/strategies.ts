export type TStrategiesAvailable = 'disk' | 'cloudinary'

export interface ICloudinaryOptions {
  cloudName: string
  apiKey: string
  apiSecret: string
}

export interface IStoreEngine {
  save(filename: string): Promise<string>
  delete(filename: string): Promise<void>
}
