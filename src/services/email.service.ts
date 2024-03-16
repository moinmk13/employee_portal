import httpStatus from "http-status";
import ApiError from "../utils/ApiError";
import config from "../config/config";
import sendEmail from "../utils/emailSender";
import Email from "../models/email.model";
import lang from '../utils/language/english'
class EmailService {
    public async sendEmails(req: any) {
        try {
            const emailOptions = {
                from: config.email.from,
                to: req.email,
                subject: req.subject,
                text: req.message,
            };
            const res = await sendEmail(emailOptions)
                .then(response => {
                    return response

                })
                .catch(error => {
                    return error
                })
            if (res.message === "Email sent successfully!") {
                const data = {
                    email: req.email,
                    subject: req.subject,
                    message: req.message,
                    user: req.id
                }
                await Email.create(data);
                return { status_code: 200, res }
            }
        } catch (error) {
            throw new ApiError(httpStatus.NOT_FOUND, lang.common.userNotFound);
        }
    };
}
export default new EmailService()
