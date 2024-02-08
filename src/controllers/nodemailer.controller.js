import enviarCorreoRecuperacion from "../services/nodemailerService.js";
import verificarExpiracion from "../services/nodemailerService.js"
import { restablecerContrasena } from "../services/nodemailerService.js";


const solicitarRecuperacionController = async (req, res) => {
    const { correo } = req.body;
    const token = "token_generado_para_el_usuario";

    const fechaExpiracion = new Date();
    fechaExpiracion.setHours(fechaExpiracion.getHours() + 1); 

    try {
        await enviarCorreoRecuperacion(correo, `${token}_${fechaExpiracion.getTime()}`);
        res.send("Correo de recuperación enviado con éxito");
    } catch (error) {
        res.status(500).send(error);
    }
}

export const verificarExpiracionController = (req, res) => {
    const { token } = req.params;

    const enlaceExpirado = verificarExpiracion(token);

    if (enlaceExpirado) {
        res.send("El enlace ha expirado");
    } else {
        res.send("El enlace aún es válido");
    }
}

export const restablecerContrasenaController = async (req, res) => {
    const { nuevaContrasena } = req.body;

    const contrasenaActual = "contrasena_actual_del_usuario";

    try {
        const nuevaContrasenaHash = restablecerContrasena(nuevaContrasena, contrasenaActual);
        res.send("Contraseña restablecida con éxito");
    } catch (error) {
        res.status(400).send(error.message);
    }
};

export default solicitarRecuperacionController
