import { NextFunction, Request, Response } from 'express'
import configCache from '@config/cache'
import Redis from 'ioredis'
import { RateLimiterRedis } from 'rate-limiter-flexible'
import AppError from '@shared/errors/AppError'

const redisClient = new Redis(configCache.config.redis)
const limiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: 'ratelimit',
  points: 5,
  duration: 1,
})

async function rateLimiter(req: Request, res: Response, next: NextFunction) {
  try {
    await limiter.consume(req.ip)
    return next()
  } catch (error) {
    throw new AppError('Too many requests.', 429)
  }
}

export default rateLimiter
