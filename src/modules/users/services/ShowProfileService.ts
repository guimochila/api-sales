import AppError from '@shared/errors/AppError'
import { inject, injectable } from 'tsyringe'
import { IShowUser } from '../domain/models/IShowUser'
import { IUsersRepository } from '../domain/repositories/IUsersRepository'
import User from '../infra/typeorm/entities/User'

@injectable()
class ShowProfileService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({ user_id }: IShowUser): Promise<User> {
    const user = await this.usersRepository.findById(user_id)

    if (!user) {
      throw new AppError('User not found.')
    }

    return user
  }
}

export default ShowProfileService
