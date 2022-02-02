import { container } from 'tsyringe'
import { IHashProvider } from './models/IHashProvider'
import { BcryptHashProvider } from './services/BCryptHashProvider'

container.registerSingleton<IHashProvider>('HashProvider', BcryptHashProvider)
