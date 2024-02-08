import User from '../models/user.model.js';

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
        // Actualizar last_connection
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


// users.controller.js
export async function getUserPremiumStatus(req, res) {
    // Lógica para obtener el estado premium del usuario con el ID proporcionado
    try {
        const userId = req.params.uid; // Paso 1: Obtener el ID del usuario de los parámetros de la solicitud

        // Paso 2: Buscar el usuario en la base de datos
        const user = await User.findById(userId);

        // Paso 3: Verificar la existencia del usuario
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        // Paso 4: Obtener el estado premium del usuario
        const premiumStatus = user.role === 'premium'; // Suponiendo que el estado premium está basado en el rol del usuario

        // Paso 5: Responder con el estado premium del usuario
        res.status(200).json({ premium: premiumStatus });

    } catch (error) {
        console.error('Error al obtener el estado premium del usuario:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}


export async function logoutUser(req, res) {

    try {
        // Lógica para cerrar sesión
        // Actualizar last_connection

        // Paso 1: Actualizar la última conexión del usuario
        const user = req.user; // Obtener el usuario actual

        user.last_connection = new Date();// Actualizar la propiedad last_connection
        await user.save();// Guardar los cambios en la base de datos
 // Paso 2: Destruir la sesión del usuario
        req.session.destroy()
        // Paso 3: Redirigir al usuario a la página de inicio de sesión
        res.redirect("/login")

    } catch (error) {
        // Manejo de errores
        // Paso 4: Manejo de errores
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
        // Obtener el usuario por el UID
        const userId = req.params.uid;
        
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        // Verificar si se subieron archivos
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: 'No se han subido archivos' });
        }

        // Procesar los archivos subidos
        req.files.forEach(file => {
            // Aquí puedes hacer lo que necesites con cada archivo,
            // como guardar su información en la base de datos o almacenarlo en el sistema de archivos.
            // Por ahora, simplemente puedes almacenar el nombre del archivo en el usuario.
            user.documents.push({ name: file.originalname, reference: file.path });
        });

        // Actualizar el estado del usuario para indicar que ha subido documentos
        user.hasUploadedDocuments = true;

        // Guardar los cambios en la base de datos
        await user.save();

        // Responder con el usuario actualizado
        res.status(200).json(user);
    } catch (error) {
        console.error('Error al subir documentos:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}




