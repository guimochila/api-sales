import { IHashProvider } from '../models/IHashProvider'

export class MockHashProvider implements IHashProvider {
  public async generateHash(payload: string): Promise<string> {
    return payload
  }
  public async compareHash(payload: string, hashed: string): Promise<boolean> {
    return payload === hashed
  }
}
