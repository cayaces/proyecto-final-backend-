import nodemailer from "nodemailer"
import dotenv from "dotenv"

dotenv.config();

const transporter = nodemailer.createTransport({
    service:"Gmail",
    auth:{
        user:process.env.userMailer,
        pass:process.env.passMailer
    }
})


class EmailService {
    static sendEmail = async (to, subject, html) => {
        try {
            const mailOptions = {
                from: process.env.userMailer,
                to,
                subject,
                html
            };

            await transporter.sendMail(mailOptions);
        } catch (error) {
            console.error('Error al enviar el correo electrónico:', error);
            throw new Error('Error al enviar el correo electrónico');
        }
    }
}


export default { transporter,
    EmailService }