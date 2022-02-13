import { ICreateProduct } from '../models/ICreateProduct'
import { IFindProducts } from '../models/IFindProducts'
import { IProduct } from '../models/IProduct'
import { IProductPaginate } from '../models/IProductPaginate'
import { IUpdateStockProduct } from '../models/IUpdateStockProduct'

export interface IProductsRepository {
  findByName(name: string): Promise<IProduct | undefined>
  findById(id: string): Promise<IProduct | undefined>
  findAllByIds(products: IFindProducts[]): Promise<IProduct[]>
  findAll(): Promise<IProduct[]>
  findAllPaginate(): Promise<IProductPaginate>
  create(data: ICreateProduct): Promise<IProduct>
  save(product: IProduct): Promise<IProduct>
  updateStock(products: IUpdateStockProduct[]): Promise<void>
  remove(product: IProduct): Promise<void>
}
