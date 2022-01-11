import auth from '@config/auth'
import AppError from '@shared/errors/AppError'
import type { NextFunction, Request, Response } from 'express'
import { verify } from 'jsonwebtoken'

interface TokenPayload {
  iat: number
  exp: number
  sub: string
}

function isAuthenticated(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization

  if (!authHeader) {
    throw new AppError('Authorization token is missing.', 401)
  }

  const [, token] = authHeader.split(' ')

  try {
    const decodedToken = verify(token, auth.jwt.secret)
    const { sub } = decodedToken as TokenPayload

    req.user = {
      id: sub,
    }

    return next()
  } catch (error) {
    throw new AppError('Invalid token authorization.', 401)
  }
}

export default isAuthenticated
