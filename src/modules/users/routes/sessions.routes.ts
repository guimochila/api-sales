import { Router } from 'express'
import { celebrate, Segments } from 'celebrate'
import Joi from 'joi'
import SessionsController from '../controllers/SessionsController'

const sessiosRouter = Router()
const sessionsController = new SessionsController()

sessiosRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    },
  }),
  sessionsController.create,
)

export default sessiosRouter
