import path from 'path'
import AppError from '@shared/errors/AppError'
import MailtrapService from '@shared/mail/MailTrapService'
import { inject, injectable } from 'tsyringe'
import { IUsersRepository } from '../domain/repositories/IUsersRepository'
import { IUserTokensRepository } from '../domain/repositories/IUserTokensRepository'
import { ISendForgotPasswordEmail } from '../domain/models/ISendForgotPasswordEmail'

@injectable()
class SendForgotPasswordEmailService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('UserTokensRepository')
    private userTokensRepository: IUserTokensRepository,
  ) {}

  public async execute({ email }: ISendForgotPasswordEmail): Promise<void> {
    const user = await this.usersRepository.findByEmail(email)

    if (!user) {
      throw new AppError('Email not found.')
    }

    const { token } = await this.userTokensRepository.generate(user.id)
    const forgotPasswordTemplate = path.resolve(
      __dirname,
      '..',
      'views',
      'forgotPassword.hbs',
    )

    await MailtrapService.sendEmail({
      to: {
        name: user.name,
        email: user.email,
      },
      subject: '[API Sales] - Password Recover',
      templateData: {
        file: forgotPasswordTemplate,
        variables: {
          name: user.name,
          link: `http://localhost:3000/reset_password?token=${token}`,
        },
      },
    })
  }
}

export default SendForgotPasswordEmailService
