import AppError from '@shared/errors/AppError'
import { addHours, isAfter } from 'date-fns'
import { hash } from 'bcryptjs'
import { getCustomRepository } from 'typeorm'
import UsersRepository from '../typeorm/repositories/UsersRepository'
import UserTokensRepository from '../typeorm/repositories/UserTokensRepository'

interface IRequest {
  token: string
  password: string
}

class ResetPasswordService {
  public async execute({ token, password }: IRequest): Promise<void> {
    const usersRepository = getCustomRepository(UsersRepository)
    const userTokenRepository = getCustomRepository(UserTokensRepository)

    const userToken = await userTokenRepository.findByToken(token)

    if (!userToken) {
      throw new AppError('User Token does not exist.')
    }

    const user = await usersRepository.findById(userToken.user_id)

    if (!user) {
      throw new AppError('User not found.')
    }

    const tokenCreatedAt = userToken.created_at
    const compareDate = addHours(tokenCreatedAt, 2)

    if (isAfter(Date.now(), compareDate)) {
      throw new AppError('Token expired.')
    }

    user.password = await hash(password, 10)

    usersRepository.save(user)
  }
}

export default ResetPasswordService
