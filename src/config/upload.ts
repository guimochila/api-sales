import path from 'path'
import crypto from 'crypto'
import multer, { StorageEngine } from 'multer'
import {
  ICloudinaryOptions,
  TStrategiesAvailable,
} from '@shared/providers/StorageProvider/strategies'

interface IUploadConfig {
  driver: TStrategiesAvailable
  tmpFolder: string
  directory: string
  multer: {
    storage: StorageEngine
  }
  cloudinaryOptions?: ICloudinaryOptions
}

const uploadFolder = path.resolve(__dirname, '..', '..', 'uploads')
const tmpFolder = path.resolve(__dirname, '..', '..', '.temp')

export default {
  driver: process.env.STORAGE_DRIVER,
  directory: uploadFolder,
  tmpFolder,
  multer: {
    storage: multer.diskStorage({
      destination: tmpFolder,
      filename(req, file, callback) {
        const fileHash = crypto.randomBytes(10).toString('hex')
        const filenameHash = crypto
          .createHash('md5')
          .update(file.originalname)
          .digest('hex')
        const fileExtension = path.extname(file.originalname)
        const filename = `${fileHash}-${filenameHash}${fileExtension}`

        callback(null, filename)
      },
    }),
  },
  cloudinaryOptions: {
    apiKey: process.env.CLOUDINARY_KEY,
    apiSecret: process.env.CLOUDINARY_SECRET,
    cloudName: process.env.CLOUDINARY_NAME,
  },
} as IUploadConfig
