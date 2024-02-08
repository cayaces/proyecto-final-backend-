import transporter from "../config/nodemailer.config.js";
import bcrypt from "bcrypt";


const enviarCorreoRecuperacion = (correo, token) => {
    return new Promise((resolve, reject) => {
        const ahora = new Date()

       const timestamp = ahora.getTime();
       const tokenConTimestamp = `${token}_${timestamp}`;

        const mailOptions = {
            from: "c.ayaces@gmail.com",
            to: "klxudys_laxik@hotmail.com",
            subject: "Recuperación de Contraseña",
            html: `
                <p>Hemos recibido una solicitud de recuperación de contraseña.</p>
                <p>Por favor, haz clic en el siguiente enlace para restablecer tu contraseña:</p>
                <a href="http://tu-sitio.com/restablecer-contrasena/${token}">Restablecer Contraseña</a>
            `,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error(error);
                reject("Error al enviar correo de recuperación");
            } else {
                console.log("Correo de recuperación enviado");
                resolve("Correo de recuperación enviado con éxito");
            }
        });
    });
};

const verificarExpiracion = (token) => {
    const timestamp = parseInt(token.split('_')[1], 10);
    const ahora = new Date();
    const expiracion = new Date(timestamp + 60 * 60 * 1000);

    return ahora <= expiracion;

};


export const restablecerContrasena = (nuevaContrasena, contrasenaActual) => {
    const contrasenaValida = bcrypt.compareSync(nuevaContrasena, contrasenaActual);
    
    if (contrasenaValida) {
        throw new Error("La nueva contraseña no puede ser igual a la contraseña actual");
    }

    const nuevaContrasenaHash = bcrypt.hashSync(nuevaContrasena, bcrypt.genSaltSync(10));
    return nuevaContrasenaHash;
};


export default {
    enviarCorreoRecuperacion,
    verificarExpiracion
}

