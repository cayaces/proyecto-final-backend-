import User from '../dao/mongo/user.model.js';
import { profileUpload, productUpload, documentUpload } from '../config/multer.config.js';
import addUser from "../services/UserService.js"
import UserService from "../services/UserService.js";

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

export async function registerUser(req, res) {

    try {
        console.log("Registering user...");
        const { name, surname, email, password, role } = req.body;

        if (!name || !surname || !email || !password || !role) {
            console.log("Faltan datos");
            res.status(400).send("Faltan datos");
        }

        res.redirect("/login");
    } catch (error) { res.status(500).send("Error al registrar usuario: " + error.message); }

}


export async function loginUser(req, res) {

    try {
        const user = req.user;
        user.last_connection = new Date();
        await user.save();
        if (user.role === "admin") {
            req.session.email = user.email
            req.session.role = user.role
            req.session.name = user.name
            req.session.surname = user.surname
            req.session.age = user.age;
            req.session.user = user;
            res.redirect("/api/users/profile")

        } else {
            req.session.email = user.email
            req.session.role = user.role
            req.session.name = user.name
            req.session.surname = user.surname
            req.session.age = user.age;
            req.session.user = user;
            res.redirect("/api/products")
        }
        console.log("Session establecida:", req.session.user);



    } catch (error) {
        res.status(500).json("Usuario o contraseña incorrectos")
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


export async function logoutUser(req, res) {

    try {
        const user = req.user;

        user.last_connection = new Date()
        await user.save();
        req.session.destroy()
        res.redirect("/login")

    } catch (error) {
        console.error('Error al cerrar sesión:', error);
        res.status(500).json({ error: 'Error interno del servidor al cerrar sesión' });
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

export async function uploadDocuments(req, res) {
    try {
        const userId = req.params.uid;
        
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: 'No se han subido archivos' });
        }

        req.files.forEach(file => {
            user.documents.push({ name: file.originalname, reference: file.path });
        });

        user.hasUploadedDocuments = true;

        await user.save();

        res.status(200).json(user);
    } catch (error) {
        console.error('Error al subir documentos:', error);
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

export async function uploadDocument(req, res) {
    documentUpload.single('document')(req, res, async (err) => {
        if (err) {
            console.error('Error al subir documento:', err);
            return res.status(500).json({ error: 'Error interno del servidor al subir documento' });
        }
    });
}




