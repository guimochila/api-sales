import AppError from '@shared/errors/AppError'
import CustomersRepository from '../typeorm/repositories/CustomersRepository'

interface IRequest {
  id: string
}

class DeleteCustomerService {
  public async execute({ id }: IRequest): Promise<void> {
    const customersRepository = new CustomersRepository()
    const customer = await customersRepository.findById(id)

    if (!customer) {
      throw new AppError('Customer not found.')
    }

    await customersRepository.remove(customer)

    return
  }
}

export default DeleteCustomerService
