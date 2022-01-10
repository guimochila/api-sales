import AppError from '@shared/errors/AppError'
import { compare } from 'bcryptjs'
import { getCustomRepository } from 'typeorm'
import User from '../typeorm/entities/User'
import UsersRepository from '../typeorm/repositories/UsersRepository'

interface IRequest {
  email: string
  password: string
}

interface IResponse {
  user: User
}

class CreateSessionService {
  public async execute({ email, password }: IRequest): Promise<IResponse> {
    const usersRepository = getCustomRepository(UsersRepository)
    const user = await usersRepository.findByEmail(email)

    if (!user) {
      throw new AppError('Invalid email/password.', 401)
    }

    const isPasswordValid = await compare(password, user.password)

    if (!isPasswordValid) {
      throw new AppError('Invalid email/password', 401)
    }

    return { user }
  }
}

export default CreateSessionService