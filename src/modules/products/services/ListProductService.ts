import { getCustomRepository } from 'typeorm'
import ProductRepository from '../infra/typeorm/repositories/ProductsRepository'
import Product from '../infra/typeorm/entities/Product'
import redisCache from '@shared/cache/RedisCache'

class ListProductService {
  public async execute(): Promise<Product[]> {
    const productsRepository = getCustomRepository(ProductRepository)

    let products = await redisCache.recover<Product[]>('api-sales-PRODUCT_LIST')

    if (!products) {
      products = await productsRepository.find()
      await redisCache.save('api-sales-PRODUCT_LIST', products)
    }

    return products
  }
}

export default ListProductService
