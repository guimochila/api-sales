import AppError from '@shared/errors/AppError'
import { inject, injectable } from 'tsyringe'
import { IProductsRepository } from '../domain/repositories/IProductsRepository'
import Product from '../infra/typeorm/entities/Product'

interface IRequest {
  id: string
}

@injectable()
class ShowProductService {
  constructor(
    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,
  ) {}
  public async execute({ id }: IRequest): Promise<Product> {
    const product = await this.productsRepository.findById(id)

    if (!product) {
      throw new AppError('Product not found', 404)
    }

    return product
  }
}

export default ShowProductService
