import { createTransport, Transporter } from 'nodemailer';
import { CONSTANT } from '../constants/message';

interface mailOptions {
  from?: string;
  to: string;
  subject: string;
  text?: string;
  html?: string;
  cc?: string | Array<string>;
  bcc?: string | Array<string>;
  attachments?: {
    filename?: string | false | undefined;
    content?: string | Buffer | undefined;
    path?: string | undefined;
    contentType?: string | undefined;
  }[];
}
export class EmailService {
  transporter: Transporter;

  constructor() {
    this.transporter = createTransport({
      service: process.env.SMTP_SERVICE,
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      requireTLS: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendMail(mailOptions: mailOptions) {
    if (!mailOptions?.from) {
      const fromEmail = process.env.SMTP_USER;
      Object.assign(mailOptions, { from: `noreply <${fromEmail}>` });
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    this.transporter.sendMail(mailOptions, (err: Error | null, info: any) => {
      if (err) {
        console.log('error', CONSTANT.ERROR.MAIL_NOT_SEND);
      }
    });
  }
}
