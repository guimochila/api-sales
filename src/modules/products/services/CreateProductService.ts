import { getCustomRepository } from 'typeorm'
import AppError from '@shared/errors/AppError'
import RedisCache from '@shared/cache/RedisCache'
import ProductRepository from '../typeorm/repositories/ProductsRepository'
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

    const redisCache = new RedisCache()

    const product = productsRepository.create({
      name,
      price,
      quantity,
    })

    await redisCache.invalidate('api-sales-PRODUCT_LIST')
    await productsRepository.save(product)

    return product
  }
}

export default CreateProductService
