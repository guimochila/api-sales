import AppError from '@shared/errors/AppError'
import storageProvider from '@shared/providers/StorageProvider'
import { inject, injectable } from 'tsyringe'
import { IUsersRepository } from '../domain/repositories/IUsersRepository'

interface IRequest {
  user_id: string
  avatarFilename: string
}

@injectable()
class UpdateUserAvatarService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({ user_id, avatarFilename }: IRequest) {
    const user = await this.usersRepository.findById(user_id)

    if (!user) {
      throw new AppError('User not found.', 404)
    }

    if (user.avatar) {
      await storageProvider.delete(user.avatar)
    }

    const filename = await storageProvider.save(avatarFilename)

    user.avatar = filename
    await this.usersRepository.save(user)

    return user
  }
}

export default UpdateUserAvatarService
