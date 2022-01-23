import AppError from '@shared/errors/AppError'
import { compare, hash } from 'bcryptjs'
import { getCustomRepository } from 'typeorm'
import User from '../typeorm/entities/User'
import UsersRepository from '../typeorm/repositories/UsersRepository'

interface IRequest {
  user_id: string
  name: string
  email: string
  password?: string
  old_password?: string
}

class UpdateProfileService {
  public async execute({
    user_id,
    name,
    email,
    password,
    old_password,
  }: IRequest): Promise<User> {
    const usersRepository = getCustomRepository(UsersRepository)
    const user = await usersRepository.findById(user_id)

    if (!user) {
      throw new AppError('User not found.')
    }

    const userUpdateEmail = await usersRepository.findByEmail(email)

    if (userUpdateEmail && userUpdateEmail.id !== user_id) {
      throw new AppError('Email is already registered in our database.')
    }

    if (password && !old_password) {
      throw new AppError('The current password is required.')
    }

    if (password && old_password) {
      const checkOldPassword = await compare(old_password, user.password)

      if (!checkOldPassword) {
        throw new AppError('Password does not match.')
      }

      user.password = await hash(password, 10)
    }

    user.name = name
    user.email = email

    await usersRepository.save(user)

    return user
  }
}

export default UpdateProfileService
