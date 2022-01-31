import { v4 as uuidv4 } from 'uuid'
import { ICreateCustomer } from '@modules/customers/domain/models/ICreateCustomer'
import { ICustomer } from '@modules/customers/domain/models/ICustomer'
import { ICustomersRepository } from '@modules/customers/domain/repositories/ICustomersRepository'
import Customer from '@modules/customers/infra/typeorm/entities/Customer'

class MockCustomersRepository
  implements Omit<ICustomersRepository, 'remove' | 'findAll'>
{
  private customers: Customer[] = []

  public async create({ name, email }: ICreateCustomer): Promise<Customer> {
    const customer = new Customer()
    customer.id = uuidv4()
    customer.name = name
    customer.email = email

    this.customers.push(customer)

    return customer
  }

  public async save(customer: ICustomer): Promise<Customer> {
    const findIndex = this.customers.findIndex(
      findCustomer => findCustomer.id === customer.id,
    )

    this.customers[findIndex] = customer
    return customer
  }

  public async findByName(name: string): Promise<Customer | undefined> {
    const customer = this.customers.find(customer => customer.name === name)

    return customer
  }

  public async findById(id: string): Promise<Customer | undefined> {
    const customer = this.customers.find(customer => customer.id === id)

    return customer
  }

  public async findByEmail(email: string): Promise<Customer | undefined> {
    const customer = this.customers.find(customer => customer.email === email)

    return customer
  }
}

export default MockCustomersRepository
