import { ICreateUser } from '@modules/users/domain/models/ICreateUser'
import { IUser } from '@modules/users/domain/models/IUser'
import { IUsersRepository } from '@modules/users/domain/repositories/IUsersRepository'
import { getRepository, Repository } from 'typeorm'
import User from '../entities/User'

class UsersRepository implements IUsersRepository {
  private ormRepo: Repository<User>

  constructor() {
    this.ormRepo = getRepository(User)
  }

  public async create({ name, email, password }: ICreateUser): Promise<IUser> {
    const user = this.ormRepo.create({ name, email, password })

    await this.ormRepo.save(user)

    return user
  }

  public async save(user: IUser): Promise<IUser> {
    await this.ormRepo.save(user)

    return user
  }

  public async findByName(name: string): Promise<User | undefined> {
    const user = await this.ormRepo.findOne({ where: { name } })

    return user
  }

  public async findById(id: string): Promise<User | undefined> {
    const user = await this.ormRepo.findOne({ where: { id } })

    return user
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    const user = await this.ormRepo.findOne({ where: { email } })

    return user
  }
}

export default UsersRepository
