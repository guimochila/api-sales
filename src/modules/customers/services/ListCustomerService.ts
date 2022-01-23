import Customer from '../typeorm/entities/Customer'
import CustomersRepository from '../typeorm/repositories/CustomersRepository'

class ListCustomerService {
  public async execute(): Promise<Customer[]> {
    const customersRepository = new CustomersRepository()

    const customers = customersRepository.find()

    return customers
  }
}

export default ListCustomerService
