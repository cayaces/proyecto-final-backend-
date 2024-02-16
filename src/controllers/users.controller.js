import UserService from "../services/UserService.js"
import UserDTO from "../dao/DTOs/user.dto.js"
import nodemailer from "nodemailer"
import { createHash, comparePasswords } from "../utils.js"
import nodeMailer from "../config/nodemailer.config.js"
import jwt from "jsonwebtoken"
import { generatePasswordResetToken } from "../config/authJWT.config.js"
import { protectedRouteHandler }  from "./authJWT.controller.js"
import CustomError from "../services/error/customError.js"
import User from '../dao/mongo/user.model.js';
import {  profileUpload } from '../config/multer.config.js';
import addUser from "../services/UserService.js"
import multer from 'multer';

const { sendMail } = nodeMailer
const userService = new UserService()

export async function registerUser(req, res, next) {
    try {
        req.logger.info("Registro de usuario");
        const { name, surname, email, password, role } = req.body;
        if (!name || !surname || !email || !password || !role) {
            return next(
                CustomError.createError({
                    statusCode: 404,
                    causeKey: USER_NOT_CREATED,
                    message: "El usuario no se ha podido crear"
                })
            )
        }
        res.redirect("/login");
    } catch (error) { res.status(500).send("Error al registrar usuario: " + error.message); }

}

export async function toggleUserRole(req, res) {
    try {
        const { userId } = req.params;
        if (!userId) {
            return res.status(400).send("Se requiere un ID de usuario válido");
        }

        const userService = new UserService();
        const updatedUser = await userService.toggleUserRole(userId);
        if (!updatedUser) {
            return res.status(404).send("Usuario no encontrado o no se pudo cambiar el rol");
        }

        res.status(200).json({ message: 'Rol del usuario cambiado exitosamente', user: updatedUser });
    } catch (error) {
        console.error("Error al cambiar el rol del usuario en el controlador:", error);
        res.status(500).json({ error: 'Error al cambiar el rol del usuario' });
    }
}
export async function loginUser(req, res) {
    try {
        let user = req.user
        req.session.email = user.email
        req.session.role = user.role
        req.session.name = user.name
        req.session.surname = user.surname
        req.session.user = user;
        req.session.last_connection = user.last_connection;
        req.session.cartId = user.cart;
        req.session.userId = user._id;
        if (user.role === "admin") {

            res.redirect("/api/users/profile")
        } else {

            res.redirect("/api/products")
        }
        req.logger.info("Sesion establecida:", req.session.user);
    } catch (error) {
        res.status(500).json("Usuario o contraseña incorrectos")
    }
}

export async function upgradeToPremium(req, res) {
    try {
        const userId = req.params.uid;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        if (!user.hasUploadedDocuments()) {
            return res.status(400).json({ error: 'El usuario no ha terminado de cargar la documentación requerida' });
        }

        user.role = 'premium';

        await user.save();

        res.status(200).json(user);
    } catch (error) {
        console.error('Error al actualizar usuario a premium:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}

export async function logoutUser(req, res) {
    try {
        let user = req.session.user
        user.last_connection = new Date();
        await userService.updateUser(user._id, user);
        req.session.destroy()
        res.redirect("/login")
    } catch (error) {
        res.status(500).json(error)
    }
}

export async function handleGitHubCallback(req, res) {

    try {
        req.session.user = req.user;
        req.session.email = req.user.email;
        req.session.role = req.user.role;

        res.redirect("/api/users/profile");

    } catch (error) {
        res.status(500).json("Autenticacion erronea de GitHub");
    }
}

export async function requestPasswordReset(req, res) {
    try {
        const { email } = req.body;
        const user = await userService.getUserByEmail(email);
        if (!user) {
            return res.status(404).json("El usuario no existe");
        }
        const resetToken = generatePasswordResetToken({ userId: user.id, email: user.email });
        const resetUrl = `http://localhost:8080/api/users/createPass/${resetToken}`;
        const emailOptions = {
            from: "c.ayaces@gmail.com",
            to: email,
            subject: "Restablecer contraseña",
            html: `<p>Para cambiar tu contraseña, haz click en el siguiente link: <a href="${resetUrl}">${resetUrl}</a></p>
            <p>Reset token: ${resetToken}</p>`
        }
        await sendMail(emailOptions);
        return res.render("confirmedMail", {
            title: "Reset Mail",
        });
    } catch (error) {
        return res.status(500).json(error.message);
    }
}

export async function renderPas(req, res) {
    const token = req.params.token;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const email = decoded.email;

    res.render("createPass", {
        title: "Restablecer contraseña",
        email: email,
        token: token
    });
}
//resetPassword
export async function resetPassword(req, res) {
    const { password, confirmedPassword } = req.body;
    const token = req.params.token;
    if (password !== confirmedPassword) {
        return res.status(400).json("Las contraseñas no coinciden");
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const email = decoded.email;
        const user = await userService.getUserByEmail(email);
        const id = user.id;
        if (!user) {
            return res.status(404).json("El usuario no existe");
        }
        if (await comparePasswords(password, user.password)) {
            return res.status(400).json("La contraseña no puede ser igual a la anterior");
        }
        const hashedPassword = await createHash(password);
        const updatedUser = { password: hashedPassword };
        await userService.updateUser(id, updatedUser);

        return res.render("confirmedReset", {
            title: "Restablecer contraseña"
        });
    } catch (error) {
        return res.status(500).json(error.message);
    }
}

export async function changeRole(req, res) {
    try {
        const { uid } = req.params;
        if (!uid) {
            return res.status(400).json("El id del usuario es requerido");
        }
        const user = await userService.getUserById(uid);
        if (!user) {
            return res.status(404).json("El usuario no existe");
        }
        let updatedUser;
        const documents = user.documents;
        const cantidadDocumentos = documents.length;
        if (cantidadDocumentos < 3) {
            return res.redirect("/documents");
        }
        const role = user.role;
        if (role === "user" && cantidadDocumentos >= 3) {
            updatedUser = { role: "premium" };
            req.session.user.role = "premium";
        }
        else {
            updatedUser = { role: "user" };
            req.session.user.role = "user";

        }
        await userService.updateUser(uid, updatedUser);
        return res.redirect("/api/users/profile");
    } catch (error) {
        return res.status(500).json(error.message);
    }
}

export async function getUserPremiumStatus(req, res) {
    try {
        const userId = req.params.uid;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        const premiumStatus = user.role === 'premium';
        res.status(200).json({ premium: premiumStatus });

    } catch (error) {
        console.error('Error al obtener el estado premium del usuario:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}

//const documentUpload = multer({ storage: documentStorage });

export const documentStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/documents/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
})

export async function uploadDocuments(req, res) {
   // documentUpload.single('document')(req, res, async (err) => {
    multer({ storage: documentStorage }).single('document')(req, res, async (err) => {
        if (err) {
            console.error('Error al subir documento:', err);
            return res.status(500).json({ error: 'Error interno del servidor al subir documento' });
        }

        try {
            const userId = req.params.uid;
            const user = await User.findById(userId);

            if (!user) {
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }

            if (!req.file) {
                return res.status(400).json({ error: 'No se ha subido ningún archivo' });
            }

            const file = req.file;
            user.documents.push({ name: file.originalname, reference: file.path });
            user.hasUploadedDocuments = true;

            await user.save();

            res.status(200).json(user);
        } catch (error) {
            console.error('Error al subir documento:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    });
}


export async function requestAllUsers(req, res) {
    if (req.session.user == undefined || req.session.user.role !== "admin") {
        return res.status(403).json("Sin permisos para realizar esta acción");
    }
    try {
        let users = await userService.getUsers();
        if (!users) {
            return res.status(404).json("No se encontraron usuarios");
        }
        users = users.map(user => new UserDTO(user));
        return res.render("users", {
            title: "Lista de Usuarios",
            users: users
        })
    }
    catch (error) {
        req.logger.error("Error en la ruta /allUsers:", error);
        return res.status(500).json(error);
    }
}

// esta funcion podria perjudicar
export async function renderUploadView(req, res) {
    try {
        const userId = req.params.uid;
        res.render('upload', { userId });
    } catch (error) {
        console.error('Error al renderizar la vista de carga de documentos:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}

export async function uploadProfilePhoto(req, res) {
    profileUpload.single('profilePhoto')(req, res, async (err) => {
        if (err) {
            console.error('Error al subir foto de perfil:', err);
            return res.status(500).json({ error: 'Error interno del servidor al subir foto de perfil' });
        }
    });
}

export async function uploadProductImage(req, res) {
    productUpload.single('productImage')(req, res, async (err) => {
        if (err) {
            console.error('Error al subir imagen de producto:', err);
            return res.status(500).json({ error: 'Error interno del servidor al subir imagen de producto' });
        }
    });
}

export async function deleteOldUsers(req, res) {
    try {
        const users = await userService.getUsers();
        if (!users) {
            return res.status(404).json("No se encontraron usuarios");
        }
        const currentDate = new Date();
        const oldUsers = users.filter(user => {
            const lastConnection = user.last_connection;
            const diff = currentDate - lastConnection;
            const days = diff / (1000 * 60 * 60 * 24);
            return days > 2;
        });
        if (oldUsers.length === 0) {
            return res.status(404).json("No hay usuarios antiguos");
        }
        oldUsers.forEach(async user => {
            let id = user._id;
            let email = user.email;
            await userService.deleteUser(id);
            const emailOptions = {
                from: "email@admin",
                to: email,
                subject: "Cuenta eliminada",
                html: `<p>Estimado usuario, su cuenta ha sido eliminada por inactividad</p>`
            };
            await sendMail(emailOptions);
        });
        const ids = oldUsers.map(user => user._id);
        await userService.deleteUser(ids);

        return res.status(200).json("Usuarios eliminados correctamente");
    } catch (error) {
        return res.status(500).json(error.message);
    }
}