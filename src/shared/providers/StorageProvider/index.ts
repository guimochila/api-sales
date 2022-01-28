import uploadConfig from '@config/upload'
import CloudinaryStorageProvider from './CloudinaryStorageProvider'
import DiskStorageProvider from './DiskStorageProvider'
import { IStoreEngine, TStrategiesAvailable } from './strategies'

class StorageProvider implements IStoreEngine {
  private client: IStoreEngine

  constructor(strategy: TStrategiesAvailable) {
    switch (strategy) {
      case 'disk':
        this.client = new DiskStorageProvider()
        break
      case 'cloudinary':
        if (!uploadConfig.cloudinaryOptions) {
          throw new Error(
            'Cloudinary options not found on config/upload file. Please, set Cloudinary options.',
          )
        }
        this.client = new CloudinaryStorageProvider(
          uploadConfig.cloudinaryOptions,
        )
        break
      default:
        throw new Error('Strategy does not exist.')
    }
  }

  public async save(filename: string): Promise<string> {
    return await this.client.save(filename)
  }

  public async delete(filename: string): Promise<void> {
    return await this.client.delete(filename)
  }
}

export default new StorageProvider(uploadConfig.driver)
