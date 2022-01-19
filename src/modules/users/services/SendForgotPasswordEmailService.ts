import AppError from '@shared/errors/AppError'
import { getCustomRepository } from 'typeorm'
import UsersRepository from '../typeorm/repositories/UsersRepository'
import UserTokensRepository from '../typeorm/repositories/UserTokensRepository'

interface IRequest {
  email: string
}

class SendForgotPasswordEmailService {
  public async execute({ email }: IRequest): Promise<void> {
    const usersRepository = getCustomRepository(UsersRepository)
    const userTokenRepository = getCustomRepository(UserTokensRepository)

    const user = await usersRepository.findByEmail(email)

    if (!user) {
      throw new AppError('Email not found.')
    }

    const token = await userTokenRepository.generate(user.id)

    console.log(token)
  }
}

export default SendForgotPasswordEmailService
