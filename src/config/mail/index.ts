import mailProdConfig from './mail.prod'
import mailDevConfig from './mail.dev'
import SMTPTransport from 'nodemailer/lib/smtp-transport'

let mailConfig: SMTPTransport.Options

if (process.env.NODE_ENV === 'production') {
  mailConfig = mailProdConfig
} else {
  mailConfig = mailDevConfig
}

export default mailConfig
