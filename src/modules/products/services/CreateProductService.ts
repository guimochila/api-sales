import { getCustomRepository } from 'typeorm'
import AppError from '@shared/errors/AppError'
import { ProductRepository } from '../typeorm/repositories/ProductsRepository'
import Product from '../typeorm/entities/Product'

interface IRequest {
  name: string
  price: number
  quantity: number
}

class CreateProductService {
  public async execute({ name, price, quantity }: IRequest): Promise<Product> {
    const productsRepository = getCustomRepository(ProductRepository)
    const productExists = await productsRepository.findByName(name)

    if (productExists) {
      throw new AppError('There is already a product with the same name')
    }

    const product = productsRepository.create({
      name,
      price,
      quantity,
    })

    await productsRepository.save(product)

    return product
  }
}

export default CreateProductService
