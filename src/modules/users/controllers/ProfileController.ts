import { Request, Response } from 'express'
import ShowProfileService from '../services/ShowProfileService'
import UpdateProfileService from '../services/UpdateProfileService'

class ProfileController {
  public async show(req: Request, res: Response): Promise<Response> {
    const user_id = req.user.id
    const showProfile = new ShowProfileService()

    const user = await showProfile.execute({ user_id })

    return res.json(user)
  }

  public async update(req: Request, res: Response): Promise<Response> {
    const user_id = req.user.id
    const { name, email, password, old_password } = req.body

    const updateProfile = new UpdateProfileService()

    const user = await updateProfile.execute({
      user_id,
      name,
      email,
      password,
      old_password,
    })

    return res.json(user)
  }
}

export default ProfileController
