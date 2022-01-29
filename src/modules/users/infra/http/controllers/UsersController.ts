import { instanceToInstance } from 'class-transformer'
import type { Request, Response } from 'express'
import CreateUserService from '../../../services/CreateUserService'
import ListUserService from '../../../services/ListUserService'

class UsersController {
  public async index(req: Request, res: Response): Promise<Response> {
    const listUser = new ListUserService()

    const users = await listUser.execute()

    return res.json(instanceToInstance(users))
  }

  public async create(req: Request, res: Response): Promise<Response> {
    const { name, email, password } = req.body
    const createUser = new CreateUserService()

    const user = await createUser.execute({ name, email, password })

    return res.status(201).json(instanceToInstance(user))
  }
}

export default UsersController
