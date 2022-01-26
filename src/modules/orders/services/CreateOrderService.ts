import { getCustomRepository } from 'typeorm'
import CustomersRepository from '@modules/customers/typeorm/repositories/CustomersRepository'
import ProductRepository from '@modules/products/typeorm/repositories/ProductsRepository'
import Order from '../typeorm/entities/Order'
import OrdersRepository from '../typeorm/repositories/OrdersRepository'
import AppError from '@shared/errors/AppError'

interface IProduct {
  id: string
  quantity: number
}

interface IRequest {
  customer_id: string
  products: IProduct[]
}

class CreateOrderService {
  public async execute({ customer_id, products }: IRequest): Promise<Order> {
    const ordersRepository = getCustomRepository(OrdersRepository)
    const customersRepository = getCustomRepository(CustomersRepository)
    const productsRepository = getCustomRepository(ProductRepository)

    const customer = await customersRepository.findById(customer_id)

    if (!customer) {
      throw new AppError('It could not find any custumer with the given id.')
    }

    const productsSelected = await productsRepository.findAllByIds(products)

    if (!productsSelected.length) {
      throw new AppError('It couldn not find any products with the given ids.')
    }

    const productsSelectedIds = productsSelected.map(product => product.id)
    const checkForProductsNotFound = products.filter(
      product => !productsSelectedIds.includes(product.id),
    )

    if (checkForProductsNotFound.length) {
      throw new AppError(
        `Could not find products: ${checkForProductsNotFound[0].id}.`,
      )
    }

    const quantityAvailable = products.filter(
      product =>
        productsSelected.filter(p => p.id === product.id)[0].quantity <
        product.quantity,
    )

    if (quantityAvailable.length) {
      throw new AppError(
        `The quantity ${quantityAvailable[0].quantity} is not available for ${quantityAvailable[0].id}`,
      )
    }

    const serializedProducts = products.map(product => ({
      product_id: product.id,
      quantity: product.quantity,
      price: productsSelected.filter(p => p.id === product.id)[0].price,
    }))

    const order = await ordersRepository.createOrder({
      customer,
      products: serializedProducts,
    })

    const { order_products } = order

    const updatedProductQuantity = order_products.map(product => ({
      id: product.product_id,
      quantity:
        productsSelected.filter(p => p.id === product.product_id)[0].quantity -
        product.quantity,
    }))

    await productsRepository.save(updatedProductQuantity)

    return order
  }
}

export default CreateOrderService
