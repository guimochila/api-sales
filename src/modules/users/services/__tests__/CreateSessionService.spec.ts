import MockUsersRepository from '@modules/users/domain/repositories/mocks/MockUsersRepository'
import AppError from '@shared/errors/AppError'
import { MockHashProvider } from '@shared/providers/HashProvider/mock/MockHashProvider'
import CreateSessionService from '../CreateSessionService'

describe('Create Session', () => {
  let mockUsersRepository: MockUsersRepository
  let createSession: CreateSessionService
  let mockHashProvider: MockHashProvider

  beforeEach(() => {
    mockUsersRepository = new MockUsersRepository()
    mockHashProvider = new MockHashProvider()
    createSession = new CreateSessionService(
      mockUsersRepository,
      mockHashProvider,
    )
  })

  it('should authenticate', async () => {
    const user = await mockUsersRepository.create({
      name: 'Test Engineer',
      email: 'teste@teste.com',
      password: '123456',
    })

    const response = await createSession.execute({
      email: 'teste@teste.com',
      password: '123456',
    })

    expect(response).toHaveProperty('token')
    expect(response.user).toEqual(user)
  })

  it('should not login with not existing user', async () => {
    expect(
      createSession.execute({
        email: 'usernotfound@teste.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError)
  })

  it('should not login with wrong password', async () => {
    await mockUsersRepository.create({
      name: 'Test Engineer',
      email: 'teste@teste.com',
      password: '123456',
    })

    expect(
      createSession.execute({
        email: 'teste@teste.com',
        password: 'wrongPassword',
      }),
    ).rejects.toBeInstanceOf(AppError)
  })
})
