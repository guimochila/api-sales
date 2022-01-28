import uploadConfig from '@config/upload'
import fs from 'fs'
import path from 'path'
import { IStoreEngine } from './strategies'

class DiskStorageProvider implements IStoreEngine {
  public async save(filename: string): Promise<string> {
    await fs.promises.rename(
      path.resolve(uploadConfig.tmpFolder, filename),
      path.resolve(uploadConfig.directory, filename),
    )

    return filename
  }

  public async delete(filename: string): Promise<void> {
    const filePath = path.resolve(uploadConfig.directory, filename)

    try {
      await fs.promises.stat(filePath)
    } catch (error) {
      return
    }

    await fs.promises.unlink(filePath)
  }
}

export default DiskStorageProvider
