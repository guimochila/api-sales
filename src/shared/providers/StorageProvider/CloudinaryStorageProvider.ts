import path from 'path'
import fs from 'fs'
import {
  v2 as cloudinary,
  UploadApiOptions,
  UploadApiResponse,
} from 'cloudinary'
import { uploadConfig } from '@config/upload'
import { IStoreEngine } from './strategies'

function upload(
  pathFile: string,
  options: UploadApiOptions,
): Promise<UploadApiResponse> {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(pathFile, options, (error, result) => {
      if (error || !result) {
        return reject(error)
      }

      resolve(result)
    })
  })
}

class CloudinaryStorageProvider implements IStoreEngine {
  private cloudName: string
  private apiKey: string
  private apiSecret: string

  constructor({
    cloudName,
    apiKey,
    apiSecret,
  }: {
    cloudName: string
    apiKey: string
    apiSecret: string
  }) {
    if (!cloudName || !apiKey || !apiSecret) {
      throw new Error(
        'Cloudinary Storage Provider requires cloudName, apiKey and apiSecret',
      )
    }

    this.cloudName = cloudName
    this.apiKey = apiKey
    this.apiSecret = apiSecret
  }

  public async save(filename: string): Promise<string> {
    const filePath = path.resolve(uploadConfig.tmpFolder, filename)

    const response = await upload(filePath, {
      // Auth
      api_key: this.apiKey,
      api_secret: this.apiSecret,
      cloud_name: this.cloudName,
    })

    try {
      await fs.promises.stat(filePath)
    } catch (error) {
      throw new Error('File not found.')
    }

    await fs.promises.unlink(filePath)

    return response.secure_url
  }

  public async delete(filename: string): Promise<void> {
    const options = {
      api_key: this.apiKey,
      api_secret: this.apiSecret,
      cloud_name: this.cloudName,
    }

    const public_id = path.parse(filename).name

    return new Promise((resolve, reject) => {
      if (filename) {
        // Options for the function destroy has some types issue.
        // TODO: Must check if it is fixed
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        cloudinary.uploader.destroy(public_id, options, (error, result) => {
          if (error) {
            reject(error)
          } else {
            resolve(result)
          }
        })
      } else {
        reject(new Error('Missing required argument "filename".'))
      }
    })
  }
}

export default CloudinaryStorageProvider
