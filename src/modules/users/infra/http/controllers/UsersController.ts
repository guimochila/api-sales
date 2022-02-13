import { instanceToInstance } from 'class-transformer'
import type { Request, Response } from 'express'
import { container } from 'tsyringe'
import CreateUserService from '../../../services/CreateUserService'
import ListUserService from '../../../services/ListUserService'

class UsersController {
  public async index(req: Request, res: Response): Promise<Response> {
    const search = req.query.search ? String(req.query.search) : undefined
    const sortField = req.query.sortField
      ? String(req.query.sortField)
      : undefined
    const listUser = container.resolve(ListUserService)

    const users = await listUser.execute(search, sortField)

    return res.json(instanceToInstance(users))
  }

  public async create(req: Request, res: Response): Promise<Response> {
    const { name, email, password } = req.body
    const createUser = container.resolve(CreateUserService)

    const user = await createUser.execute({ name, email, password })

    return res.status(201).json(instanceToInstance(user))
  }
}

export default UsersController
