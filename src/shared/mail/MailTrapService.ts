import nodemailer from 'nodemailer'
import mailConfig from '@config/mail'
import HandlebarsMailTemplate, {
  IParseMailTemplate,
} from './HandlebarsMailTemplate'

interface IMailContact {
  name: string
  email: string
}

interface ISendEmail {
  to: IMailContact
  from?: IMailContact
  subject: string
  templateData: IParseMailTemplate
}

class MailtrapService {
  static async sendEmail({
    to,
    from,
    subject,
    templateData,
  }: ISendEmail): Promise<void> {
    const mailTemplate = new HandlebarsMailTemplate()
    const transporter = nodemailer.createTransport(mailConfig)

    await transporter.sendMail({
      from: {
        name: from?.name || 'API Sales support',
        address: from?.email || 'support@apisales.com',
      },
      to: {
        name: to.name,
        address: to.email,
      },
      subject,
      html: await mailTemplate.parse(templateData),
    })
  }
}

export default MailtrapService
