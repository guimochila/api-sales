import { IUserTokensRepository } from '@modules/users/domain/repositories/IUserTokensRepository'
import { getRepository, Repository } from 'typeorm'
import UserToken from '../entities/UserToken'

class UserTokensRepository implements IUserTokensRepository {
  private ormRepo: Repository<UserToken>

  constructor() {
    this.ormRepo = getRepository(UserToken)
  }

  public async findByToken(token: string): Promise<UserToken | undefined> {
    const userToken = await this.ormRepo.findOne({ where: { token } })

    return userToken
  }

  public async generate(user_id: string): Promise<UserToken> {
    const userToken = await this.ormRepo.create({ user_id })

    await this.ormRepo.save(userToken)

    return userToken
  }
}

export default UserTokensRepository
