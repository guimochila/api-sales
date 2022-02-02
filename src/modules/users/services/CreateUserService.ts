import AppError from '@shared/errors/AppError'
import { inject, injectable } from 'tsyringe'
import User from '../infra/typeorm/entities/User'
import { IHashProvider } from '@shared/providers/HashProvider/models/IHashProvider'
import { IUsersRepository } from '../domain/repositories/IUsersRepository'
import { ICreateUser } from '../domain/models/ICreateUser'

@injectable()
class CreateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('HashContainer')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({ email, password, name }: ICreateUser): Promise<User> {
    const isEmailExists = await this.usersRepository.findByEmail(email)

    if (isEmailExists) {
      throw new AppError('Email address is already registered.')
    }

    const hashedPassword = await this.hashProvider.generateHash(password)

    const user = await this.usersRepository.create({
      name,
      email,
      password: hashedPassword,
    })

    return user
  }
}

export default CreateUserService
