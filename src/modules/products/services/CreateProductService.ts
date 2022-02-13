import AppError from '@shared/errors/AppError'
import redisCache from '@shared/cache/RedisCache'
import Product from '../infra/typeorm/entities/Product'
import { inject, injectable } from 'tsyringe'
import { IProductsRepository } from '../domain/repositories/IProductsRepository'

interface IRequest {
  name: string
  price: number
  quantity: number
}

@injectable()
class CreateProductService {
  constructor(
    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,
  ) {}

  public async execute({ name, price, quantity }: IRequest): Promise<Product> {
    const productExists = await this.productsRepository.findByName(name)

    if (productExists) {
      throw new AppError('There is already a product with the same name')
    }

    await redisCache.invalidate('api-sales-PRODUCT_LIST')

    const product = await this.productsRepository.create({
      name,
      price,
      quantity,
    })

    return product
  }
}

export default CreateProductService
