import path from 'path'
import crypto from 'crypto'
import multer from 'multer'

const uploadFolder = path.resolve(__dirname, '..', '..', 'uploads')

export default {
  directory: uploadFolder,
  storage: multer.diskStorage({
    destination: uploadFolder,
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
}
