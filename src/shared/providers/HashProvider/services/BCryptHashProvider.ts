import { compare, hash } from 'bcryptjs'
import { IHashProvider } from '../models/IHashProvider'

export class BcryptHashProvider implements IHashProvider {
  generateHash(payload: string): Promise<string> {
    return hash(payload, 10)
  }
  compareHash(payload: string, hashed: string): Promise<boolean> {
    return compare(payload, hashed)
  }
}
