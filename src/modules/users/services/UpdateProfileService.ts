import AppError from '@shared/errors/AppError'
import { compare, hash } from 'bcryptjs'
import { inject, injectable } from 'tsyringe'
import { IUpdateProfile } from '../domain/models/IUpdateProfile'
import { IUsersRepository } from '../domain/repositories/IUsersRepository'
import User from '../infra/typeorm/entities/User'

@injectable()
class UpdateProfileService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({
    user_id,
    name,
    email,
    password,
    old_password,
  }: IUpdateProfile): Promise<User> {
    const user = await this.usersRepository.findById(user_id)

    if (!user) {
      throw new AppError('User not found.')
    }

    const userUpdateEmail = await this.usersRepository.findByEmail(email)

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

    await this.usersRepository.save(user)

    return user
  }
}

export default UpdateProfileService
