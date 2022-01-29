import AppError from '@shared/errors/AppError'
import { hash } from 'bcryptjs'
import { getCustomRepository } from 'typeorm'
import User from '../infra/typeorm/entities/User'
import UsersRepository from '../infra/typeorm/repositories/UsersRepository'

interface IRequest {
  email: string
  password: string
  name: string
}

class CreateUserService {
  public async execute({ email, password, name }: IRequest): Promise<User> {
    const usersRepository = getCustomRepository(UsersRepository)
    const isEmailExists = await usersRepository.findByEmail(email)

    if (isEmailExists) {
      throw new AppError('Email address is already registered.')
    }

    const hashedPassword = await hash(password, 10)

    const user = usersRepository.create({
      name,
      email,
      password: hashedPassword,
    })

    await usersRepository.save(user)

    return user
  }
}

export default CreateUserService
