import express from "express"
import solicitarRecuperacionController from "../controllers/nodemailer.controller.js"
import { verificarExpiracionController } from "../controllers/nodemailer.controller.js";
import expressHandlebars from "express-handlebars";
import { restablecerContrasenaController } from "../controllers/nodemailer.controller.js";


const render = expressHandlebars.render;
export const resetPasswordRouter = express.Router();

export const recuperacionRouter = express.Router();
export const verificarExpiracionRouter = express.Router();

resetPasswordRouter.post("/restablecer-contrasena", restablecerContrasenaController);

resetPasswordRouter.get("/restablecer-contrasena", (req, res) => {
    res.render("restablecer-contrasena", {
        title: "Restablecer Contraseña"
    });
});

recuperacionRouter.post("/solicitar-recuperacion", solicitarRecuperacionController);
verificarExpiracionRouter.get("/verificar-expiracion/:token", verificarExpiracionController);
