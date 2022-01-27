import RedisCache from '@shared/cache/RedisCache'
import AppError from '@shared/errors/AppError'
import { getCustomRepository } from 'typeorm'
import Product from '../typeorm/entities/Product'
import ProductRepository from '../typeorm/repositories/ProductsRepository'

interface IRequest {
  id: string
  name: string
  price: number
  quantity: number
}

class UpdateProductService {
  public async execute({
    id,
    name,
    price,
    quantity,
  }: IRequest): Promise<Product> {
    const productRepository = getCustomRepository(ProductRepository)

    const product = await productRepository.findOne(id)
    if (!product) {
      throw new AppError('Product not found', 404)
    }

    const productExist = await productRepository.findByName(name)
    if (productExist && name !== product.name) {
      throw new AppError('Product name already exists')
    }

    Object.assign(product, { name, price, quantity })

    const redisCache = new RedisCache()
    await redisCache.invalidate('api-sales-PRODUCT_LIST')

    await productRepository.save(product)

    return product
  }
}

export default UpdateProductService
