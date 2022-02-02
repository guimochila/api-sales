import AppError from '@shared/errors/AppError'
import { sign } from 'jsonwebtoken'
import { getCustomRepository } from 'typeorm'
import User from '../infra/typeorm/entities/User'
import UsersRepository from '../infra/typeorm/repositories/UsersRepository'
import authConfig from '@config/auth'
import { inject, injectable } from 'tsyringe'
import { IHashProvider } from '@shared/providers/HashProvider/models/IHashProvider'

interface IRequest {
  email: string
  password: string
}

interface IResponse {
  user: User
  token: string
}

@injectable()
class CreateSessionService {
  constructor(
    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}
  public async execute({ email, password }: IRequest): Promise<IResponse> {
    const usersRepository = getCustomRepository(UsersRepository)
    const user = await usersRepository.findByEmail(email)

    if (!user) {
      throw new AppError('Invalid email/password.', 401)
    }

    const isPasswordValid = await this.hashProvider.compareHash(
      password,
      user.password,
    )

    if (!isPasswordValid) {
      throw new AppError('Invalid email/password', 401)
    }

    const token = sign({}, authConfig.jwt.secret, {
      subject: user.id,
      expiresIn: authConfig.jwt.expiresIn,
    })

    return { user, token }
  }
}

export default CreateSessionService
