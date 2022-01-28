import { Router } from 'express'
import { celebrate, Segments } from 'celebrate'
import Joi from 'joi'
import multer from 'multer'
import isAuthenticated from '@shared/http/middlewares/isAuthenticated'
import uploadConfig from '@config/upload'
import UsersController from '../controllers/UsersController'
import UserAvatarController from '../controllers/UserAvatarController'

const usersRouter = Router()
const usersController = new UsersController()
const usersAvatarController = new UserAvatarController()

const upload = multer(uploadConfig.multer)

usersRouter.get('/', isAuthenticated, usersController.index)

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

usersRouter.patch(
  '/avatar',
  isAuthenticated,
  upload.single('avatar'),
  usersAvatarController.update,
)

export default usersRouter
