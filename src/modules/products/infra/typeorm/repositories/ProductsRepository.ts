import { getRepository, In, Repository } from 'typeorm'
import { IFindProducts } from '@modules/products/domain/models/IFindProducts'
import Product from '../entities/Product'
import { IProductsRepository } from '@modules/products/domain/repositories/IProductsRepository'
import { IProduct } from '@modules/products/domain/models/IProduct'
import { ICreateProduct } from '@modules/products/domain/models/ICreateProduct'
import { IProductPaginate } from '@modules/products/domain/models/IProductPaginate'
import { IUpdateStockProduct } from '@modules/products/domain/models/IUpdateStockProduct'

class ProductsRepository implements IProductsRepository {
  private ormRepo: Repository<Product>

  constructor() {
    this.ormRepo = getRepository(Product)
  }
  public async findById(id: string): Promise<IProduct | undefined> {
    const product = await this.ormRepo.findOne(id)

    return product
  }

  public async findAll(): Promise<IProduct[]> {
    const products = await this.ormRepo.find()

    return products
  }

  public async findAllPaginate(): Promise<IProductPaginate> {
    const products = await this.ormRepo.createQueryBuilder().paginate()

    return products as IProductPaginate
  }

  public async create({
    name,
    price,
    quantity,
  }: ICreateProduct): Promise<IProduct> {
    const product = this.ormRepo.create({ name, price, quantity })

    await this.ormRepo.save(product)

    return product
  }

  public async save(product: Product): Promise<IProduct> {
    await this.ormRepo.save(product)

    return product
  }

  public async updateStock(products: IUpdateStockProduct[]): Promise<void> {
    await this.ormRepo.save(products)
  }

  public async remove(product: IProduct): Promise<void> {
    await this.ormRepo.remove(product)
  }

  public async findByName(name: string): Promise<Product | undefined> {
    const product = await this.ormRepo.findOne({ where: { name } })

    return product
  }

  public async findAllByIds(products: IFindProducts[]): Promise<Product[]> {
    const productsIds = products.map(product => product.id)

    const productsFound = await this.ormRepo.find({
      where: {
        id: In(productsIds),
      },
    })

    return productsFound
  }
}

export default ProductsRepository
