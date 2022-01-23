import isAuthenticated from '@shared/http/middlewares/isAuthenticated'
import { celebrate, Segments } from 'celebrate'
import { Router } from 'express'
import Joi from 'joi'
import ProfileController from '../controllers/ProfileController'

const profileRouter = Router()
const profileController = new ProfileController()

profileRouter.use(isAuthenticated)
profileRouter.get('/', profileController.show)
profileRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      old_password: Joi.string(),
      password: Joi.string().optional(),
      password_confirmation: Joi.string()
        .valid(Joi.ref('password'))
        .when('password', { is: Joi.exist(), then: Joi.required() }),
    },
  }),
  profileController.update,
)

export default profileRouter
