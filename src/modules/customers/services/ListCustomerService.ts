import { inject, injectable } from 'tsyringe'
import { ICustomersRepository } from '../domain/repositories/ICustomersRepository'
import Customer from '../infra/typeorm/entities/Customer'

interface IPaginateCustomer {
  from: number
  to: number
  per_page: number
  total: number
  current_page: number
  prev_page: number | null
  next_page: number | null
  data: Customer[]
}

@injectable()
class ListCustomerService {
  constructor(
    @inject('CustomersRepository')
    private customersRepository: ICustomersRepository,
  ) {}

  public async execute(): Promise<IPaginateCustomer> {
    const customers = await this.customersRepository.findAllPaginate()

    return customers as IPaginateCustomer
  }
}

export default ListCustomerService
