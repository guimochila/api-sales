import 'dotenv/config'
import 'reflect-metadata'
import express, { NextFunction, Request, Response } from 'express'
import 'express-async-errors'
import cors from 'cors'
import { errors } from 'celebrate'
import { pagination } from 'typeorm-pagination'
import routes from './routes'
import AppError from '@shared/errors/AppError'
import '@shared/typeorm'
import uploadConfig from '@config/upload'
import rateLimiter from './middlewares/rateLimiter'

const app = express()

app.use(cors())
app.use(express.json())
app.use(rateLimiter)
app.use(pagination)
app.use('/static', express.static(uploadConfig.directory))
app.use(routes)

app.use(errors())
app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  if (process.env.NODE_ENV !== 'production' && !(error instanceof AppError)) {
    console.log(error)
  }

  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      status: 'error',
      message: error.message,
    })
  }

  return res.status(500).json({
    status: 'error',
    message: 'Internal Server Error',
  })
})

const port = process.env.PORT

app.listen(port, () => {
  console.log(`Server started on port ${port}! 🚀`)
})
