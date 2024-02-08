import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const authorizeRole = (role) => {
    return (req, res, next) => {
        const currentUser = req.user;

        if (!currentUser || currentUser.role !== role) {
            return res.status(403).send("Acceso no autorizado");
        }
        next();
    };
}

export const connectMongo = async () => {

    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Conectado a la DB");

    } catch (error) {
        console.log("Error al conectarse a la DB: ", error);
        process.exit();
    }
}

export  default authorizeRole