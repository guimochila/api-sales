import { container } from 'tsyringe'
import { ICustomersRepository } from '@modules/customers/domain/repositories/ICustomersRepository'
import CustomersRepository from '@modules/customers/infra/typeorm/repositories/CustomersRepository'
import { IUsersRepository } from '@modules/users/domain/repositories/IUsersRepository'
import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository'

import '../providers/HashProvider'

container.registerSingleton<ICustomersRepository>(
  'CustomersRepository',
  CustomersRepository,
)
container.registerSingleton<IUsersRepository>(
  'UsersRepository',
  UsersRepository,
)
