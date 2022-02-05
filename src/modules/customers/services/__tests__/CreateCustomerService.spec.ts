import MockCustomersRepository from '@modules/customers/domain/repositories/mocks/MockCustomersRepository'
import AppError from '@shared/errors/AppError'
import CreateCustomersService from '../CreateCustomerService'

describe('CreateCustomer', () => {
  let customersRepository: MockCustomersRepository
  let createCustomer: CreateCustomersService

  beforeEach(() => {
    customersRepository = new MockCustomersRepository()
    createCustomer = new CreateCustomersService(customersRepository)
  })

  it('should create a new customer', async () => {
    const customer = await createCustomer.execute({
      name: 'Testing User',
      email: 'testing@email.com',
    })

    expect(customer).toHaveProperty('id')
  })

  it('should not create a new customer if email exist', async () => {
    await createCustomer.execute({
      name: 'Testing User',
      email: 'testing@email.com',
    })

    expect(
      createCustomer.execute({
        name: 'Testing User',
        email: 'testing@email.com',
      }),
    ).rejects.toBeInstanceOf(AppError)
  })
})
