import redisCache from '@shared/cache/RedisCache'
import AppError from '@shared/errors/AppError'
import { inject, injectable } from 'tsyringe'
import { IUpdateProduct } from '../domain/models/IUpdateProduct'
import { IProductsRepository } from '../domain/repositories/IProductsRepository'
import Product from '../infra/typeorm/entities/Product'

@injectable()
class UpdateProductService {
  constructor(
    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,
  ) {}

  public async execute({
    id,
    name,
    price,
    quantity,
  }: IUpdateProduct): Promise<Product> {
    const product = await this.productsRepository.findById(id)
    if (!product) {
      throw new AppError('Product not found', 404)
    }

    const productExist = await this.productsRepository.findByName(name)
    if (productExist && name !== product.name) {
      throw new AppError('Product name already exists')
    }

    Object.assign(product, { name, price, quantity })

    await redisCache.invalidate('api-sales-PRODUCT_LIST')

    await this.productsRepository.save(product)

    return product
  }
}

export default UpdateProductService
