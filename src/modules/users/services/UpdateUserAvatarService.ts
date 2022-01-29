import AppError from '@shared/errors/AppError'
import { getCustomRepository } from 'typeorm'
import UsersRepository from '../infra/typeorm/repositories/UsersRepository'
import storageProvider from '@shared/providers/StorageProvider'

interface IRequest {
  user_id: string
  avatarFilename: string
}

class UpdateUserAvatarService {
  public async execute({ user_id, avatarFilename }: IRequest) {
    const usersRepository = getCustomRepository(UsersRepository)

    const user = await usersRepository.findById(user_id)

    if (!user) {
      throw new AppError('User not found.', 404)
    }

    if (user.avatar) {
      await storageProvider.delete(user.avatar)
    }

    const filename = await storageProvider.save(avatarFilename)

    user.avatar = filename
    await usersRepository.save(user)

    return user
  }
}

export default UpdateUserAvatarService
