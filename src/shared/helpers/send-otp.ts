import { CONSTANT } from '../constants/message';
import { EmailService } from './send-mail';
import { renderFile } from 'ejs';
import { join } from 'path';

const sendOtp = async (user: any, otp: number) => {
  const emailService = new EmailService();

  const ejsTemplate = await renderFile(
    join(__dirname + '/../../../shared/ejs-templates/verification-otp.ejs'),
    {
      name: user.first_name + ' ' + user.last_name,
      minutes: 10,
      otp: otp,
    },
  );
  await emailService.sendMail({
    to: user.email,
    subject: CONSTANT.EMAIL.VERIFICATION_OTP_SUBJECT,
    html: ejsTemplate,
  });
  return otp;
};

export default sendOtp;
