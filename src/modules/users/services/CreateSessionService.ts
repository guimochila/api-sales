import AppError from '@shared/errors/AppError'
import { sign } from 'jsonwebtoken'
import authConfig from '@config/auth'
import { inject, injectable } from 'tsyringe'
import { IHashProvider } from '@shared/providers/HashProvider/models/IHashProvider'
import { IUsersRepository } from '../domain/repositories/IUsersRepository'
import { ICreateSession } from '../domain/models/ICreateSession'
import { IUserAuthenticated } from '../domain/models/IUserAuthenticated'

@injectable()
class CreateSessionService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}
  public async execute({
    email,
    password,
  }: ICreateSession): Promise<IUserAuthenticated> {
    const user = await this.usersRepository.findByEmail(email)

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
