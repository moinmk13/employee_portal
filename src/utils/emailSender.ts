import nodemailer, { Transporter, SendMailOptions, SentMessageInfo } from 'nodemailer';
import config from '../config/config';
import lang from './language/english'
function sendEmail(options: SendMailOptions): Promise<{ message: string; success?: string }> {
    const transporter: Transporter = nodemailer.createTransport(config.email.smtp);

    return new Promise((resolve, reject) => {
        transporter.sendMail(options, (error: Error | null, info: SentMessageInfo) => {
            if (error) {
                reject(`Error sending email: ${error.message}`);
            } else {
                resolve({
                    message: lang.otpEmail.emailSendSuccessfully,
                    success: `Message ID: ${info.messageId}`,
                });
            }
        });
    });
}

export default sendEmail;
