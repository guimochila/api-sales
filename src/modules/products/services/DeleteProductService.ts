import RedisCache from '@shared/cache/RedisCache'
import AppError from '@shared/errors/AppError'
import { getCustomRepository } from 'typeorm'
import ProductRepository from '../typeorm/repositories/ProductsRepository'

interface IRequest {
  id: string
}

class DeleteProductService {
  public async execute({ id }: IRequest): Promise<void> {
    const productRepository = getCustomRepository(ProductRepository)

    const product = await productRepository.findOne(id)

    if (!product) {
      throw new AppError('Product not found.', 404)
    }

    const redisCache = new RedisCache()
    await redisCache.invalidate('api-sales-PRODUCT_LIST')

    await productRepository.remove(product)
  }
}

export default DeleteProductService
