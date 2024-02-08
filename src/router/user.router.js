import express from "express";
import multer from "multer";
import { uploadDocuments } from "../controllers/users.controller.js"
import passport from "passport";
import { registerUser, loginUser, logoutUser, handleGitHubCallback, getUserPremiumStatus } from "../controllers/users.controller.js";
import UserDTO from "../dao/DTOs/user.dto.js";

const UserRouter = express.Router()

UserRouter.post("/register",
    passport.authenticate("register",
        { failureRedirect: "/failregister" }), registerUser
)

UserRouter.get("/failregister", async (req, res) => {
    console.log("Failed Strategy")
    res.send({ error: "Failed" })
})

// Ruta para iniciar sesión
UserRouter.post('/login', loginUser);
/*UserRouter.post("/login",
    passport.authenticate("login",
        { failureRedirect: "/faillogin" }), loginUser
)*/

// Ruta para cerrar sesión
UserRouter.get("/logout", logoutUser)


UserRouter.get("/faillogin", async (req, res) => {
    res.send({ error: "Failed Login" })
})

//UserRouter.get('/premium/:uid', getUserPremiumStatus);
// Ruta para obtener el estado premium de un usuario
UserRouter.get('/premium/:uid', async (req, res) => {
    try {
        const { uid } = req.params; // Obtener el ID del usuario de los parámetros de la URL

        // Lógica para obtener el estado premium del usuario con el ID proporcionado
        const premiumStatus = await getUserPremiumStatus(uid);

        // Verificar si se obtuvo el estado premium correctamente
        if (premiumStatus === null) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        // Devolver el estado premium del usuario
        res.status(200).json({ premium: premiumStatus });
    } catch (error) {
        console.error('Error en la ruta /premium/:uid:', error);
        res.status(500).json({ error: 'Error al obtener el estado premium del usuario' });
    }
});



UserRouter.get("/github", passport.authenticate("github", { scope: ["user: email"] }), async (req, res) => {
    console.log("Redirecting to GitHub for authentication...")
})

UserRouter.get("/githubcallback", passport.authenticate("github", { failureRedirect: "/login" }), handleGitHubCallback);

UserRouter.get("/profile", async (req, res) => {
    try {
        let user = req.session.user

        if (!user || !user.email) {
            res.redirect("/login")
        }
        const userData = {
            email: user.email,
            role: user.role,
        }

        res.render("profile", {
            title: "Perfil de Usuario",
            user: userData
        })
    } catch (error) {
        console.error("Error en la ruta /profile:", error);
        res.status(500).json(error);
    }
})

UserRouter.get("/current", async (req, res) => {
    try {
        let user = req.session.user

        if (!user) {
            res.redirect("/login")
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

        res.render("current", {
            title: "Perfil de Usuario",
            user: userSafe
        })
    } catch (error) {
        console.error("Error en la ruta /current:", error);
        res.status(500).json(error);
    }
})

// Configurar Multer para la subida de archivos
const upload = multer({ dest: 'uploads/' });

// Ruta para subir documentos
router.post('/:uid/documents', upload.array('documents'), uploadDocuments);

export default UserRouter;



