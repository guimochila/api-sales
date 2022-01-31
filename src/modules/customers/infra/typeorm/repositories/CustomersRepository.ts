import { ICreateCustomer } from '@modules/customers/domain/models/ICreateCustomer'
import { ICustomer } from '@modules/customers/domain/models/ICustomer'
import { ICustomersRepository } from '@modules/customers/domain/repositories/ICustomersRepository'
import { getRepository, Repository } from 'typeorm'
import Customer from '../entities/Customer'

class CustomersRepository implements ICustomersRepository {
  private ormRepo: Repository<Customer>

  constructor() {
    this.ormRepo = getRepository(Customer)
  }

  public async findByName(name: string): Promise<Customer | undefined> {
    const customer = await this.ormRepo.findOne({ where: { name } })

    return customer
  }

  public async findById(id: string): Promise<Customer | undefined> {
    const customer = await this.ormRepo.findOne({ where: { id } })

    return customer
  }

  public async findByEmail(email: string): Promise<Customer | undefined> {
    const customer = await this.ormRepo.findOne({ where: { email } })

    return customer
  }

  public async create({ name, email }: ICreateCustomer): Promise<Customer> {
    const customer = this.ormRepo.create({ name, email })

    await this.ormRepo.save(customer)

    return customer
  }

  public async save(customer: ICustomer): Promise<ICustomer> {
    await this.ormRepo.save(customer)

    return customer
  }
}

export default CustomersRepository
