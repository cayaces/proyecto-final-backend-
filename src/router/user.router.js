import express from "express";
import multer from "multer"
import { renderUploadView, uploadDocuments, resetPassword } from "../controllers/users.controller.js"
import { upgradeToPremium } from '../controllers/users.controller.js';
import passport from "passport";
import { registerUser, loginUser, logoutUser, handleGitHubCallback, requestPasswordReset, renderPas, changeRole, requestAllUsers, deleteOldUsers} from "../controllers/users.controller.js";
import UserDTO from "../dao/DTOs/user.dto.js";
import {  profileUpload } from '../config/multer.config.js';

const UserRouter = express.Router()

UserRouter.post("/register",
    passport.authenticate("register",
    { failureRedirect: "/api/users/failregister" }), registerUser
    )

UserRouter.get("/failregister", async (req, res) => {
    req.logger.error("Failed Strategy")
    res.send({ error: "Failed" })
})

UserRouter.post("/login",
    passport.authenticate("login",
        { failureRedirect: "/faillogin" }), loginUser
)

UserRouter.get("/faillogin", async (req, res) => {
    res.send({ error: "Failed Login" })
})

UserRouter.get("/logout", logoutUser)

UserRouter.get("/github", passport.authenticate("github", { scope: ["user: email"] }), async (req, res) => {
    req.logger.info("Autenticando GitHub")
})

UserRouter.get("/githubcallback", passport.authenticate("github", { failureRedirect: "/login" }), handleGitHubCallback);

UserRouter.get("/profile", async (req, res) => {
    try {
        let user = req.session.user
        let cartId = req.session.cartId;

        if (!user || !user.email) {
           return res.redirect("/login")
        }
        const userData = {
            id: user._id,
            email: user.email,
            role: user.role,
        }
        let isAdmin = false;
        let isAuthorized = false
        if (user.role === "admin") {
            isAdmin = true;
            isAuthorized = true;
        } else if (user.role === "premium") {
            isAdmin = false;
            isAuthorized = true;
        }

        return res.render("profile", {
            title: "Perfil de Usuario",
            user: userData,
            isAdmin: isAdmin,
            isAuthorized: isAuthorized,
            cartId: cartId
        })
    } catch (error) {
       req.logger.error("Error en la ruta /profile:", error);
       return res.status(500).json(error);
    }
})

//borrar funcion
UserRouter.get('/premium/:uid', async (req, res) => {
    try {
        const { uid } = req.params;

        const premiumStatus = await getUserPremiumStatus(uid);

        if (premiumStatus === null) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        res.status(200).json({ premium: premiumStatus });
    } catch (error) {
        console.error('Error en la ruta /premium/:uid:', error);
        res.status(500).json({ error: 'Error al obtener el estado premium del usuario' });
    }
});


UserRouter.get("/current", async (req, res) => {
    try {
        let user = req.session.user
        let cartId = req.session.cartId

        if (!user || user == null || user == undefined) {
            req.logger.error("No se encontró el usuario")
            return res.redirect("/login")
        }
        const userData = {
            name: user.name,
            surname: user.surname,
            email: user.email,
            age: user.age,
            password: user.password,
            cart: user.cart,
            role: user.role
        }

        const userSafe = new UserDTO(userData).toSafeObject()

        return res.render("current", {
            title: "Perfil de Usuario",
            user: userSafe,
            cartId: cartId
        })
    } catch (error) {
        req.logger.error("Error en la ruta /current:", error);
        return res.status(500).json(error);
    }
})

UserRouter.get("/allUsers", requestAllUsers)

UserRouter.post("/request-password", requestPasswordReset)

//ruta para vista para que el usuario cree una nueva contraseña
UserRouter.get("/createPass/:token", renderPas)

// Ruta para enviar correo de recuperacion de contraseña
UserRouter.post("/createPass/:token", resetPassword)

//Ruta para cambiar el rol del usuario
UserRouter.get("/premium/:uid", changeRole)

const upload = multer({ dest: 'uploads/' });

//Ruta para subir documentos uploads
UserRouter.post("/:uid/documents", upload.array("documents"), uploadDocuments)

// Ruta para renderizar la vista de carga de documentos
UserRouter.get('/:uid/upload', renderUploadView);

// Ruta para subir documentos
UserRouter.post('/:uid/documents', uploadDocuments);
//Ruta Eliminar usuarios
UserRouter.post("/deleteOldUsers", deleteOldUsers)

//UserRouter.post('/:uid/documents', upload.array('documents'), uploadDocuments);

UserRouter.put('/premium/:uid', upgradeToPremium);


export default UserRouter;



