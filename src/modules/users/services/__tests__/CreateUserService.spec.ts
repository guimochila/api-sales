import MockUsersRepository from '@modules/users/domain/repositories/mocks/MockUsersRepository'
import AppError from '@shared/errors/AppError'
import { MockHashProvider } from '@shared/providers/HashProvider/mock/MockHashProvider'
import CreateUserService from '../CreateUserService'

describe('CreateUser', () => {
  let mockUsersRepository: MockUsersRepository
  let createUser: CreateUserService
  let mockHashProvider: MockHashProvider

  beforeEach(() => {
    mockUsersRepository = new MockUsersRepository()
    mockHashProvider = new MockHashProvider()
    createUser = new CreateUserService(mockUsersRepository, mockHashProvider)
  })

  it('should create a new user', async () => {
    const user = await createUser.execute({
      name: 'Test Engineer',
      email: 'teste@teste.com',
      password: '123456',
    })

    expect(user).toHaveProperty('id')
  })

  it('should not create a new user if email exist', async () => {
    await createUser.execute({
      name: 'Testing User',
      email: 'testing@email.com',
      password: '12345',
    })

    expect(
      createUser.execute({
        name: 'Testing User',
        email: 'testing@email.com',
        password: '12345',
      }),
    ).rejects.toBeInstanceOf(AppError)
  })
})
