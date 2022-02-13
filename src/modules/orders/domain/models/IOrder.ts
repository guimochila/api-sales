import { ICustomer } from '@modules/customers/domain/models/ICustomer'
import { IOrdersProducts } from './IOrdersProducts'

export interface IOrder {
  id: string
  customer: ICustomer
  order_products: IOrdersProducts[]
  created_at: Date
  updated_at: Date
}
