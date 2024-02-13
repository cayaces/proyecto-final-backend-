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

            await transporter.sendMail(mailOptions)
            console.log("Correo enviado con exito")
        } catch (error) {
            console.log('Error al enviar el correo electrónico:', error);
            throw new Error('Error al enviar el correo electrónico');
        }
    }
}


export default { transporter,
    EmailService }
   /* import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: process.env.USER_MAILER,
        pass: process.env.PASS_MAILER
    }
});

class EmailService {
    static sendEmail = async (to, subject, html) => {
        try {
            const mailOptions = {
                from: process.env.USER_MAILER,
                to,
                subject,
                html
            };

            await transporter.sendMail(mailOptions)
            console.log("Correo enviado con exito")
        } catch (error) {
            console.log('Error al enviar el correo electrónico:', error);
            throw new Error('Error al enviar el correo electrónico');
        }
    }
}

export default { transporter, EmailService };*/
