import AppError from '@shared/errors/AppError'
import fs from 'fs'
import path from 'path'
import { getCustomRepository } from 'typeorm'
import UsersRepository from '../typeorm/repositories/UsersRepository'
import uploadConfig from '@config/upload'

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
      const userAvatarFilePath = path.join(uploadConfig.directory, user.avatar)
      const isUserAvatarFileExists = await fs.promises.stat(userAvatarFilePath)

      if (isUserAvatarFileExists) {
        await fs.promises.unlink(userAvatarFilePath)
      }
    }
    user.avatar = avatarFilename
    await usersRepository.save(user)

    return user
  }
}

export default UpdateUserAvatarService
