import { Router } from 'express'
import { celebrate, Segments } from 'celebrate'
import UsersController from '../controllers/UsersController'
import Joi from 'joi'

const usersRouter = Router()
const usersController = new UsersController()

usersRouter.get('/', usersController.index)

usersRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    },
  }),
  usersController.create,
)

export default usersRouter
