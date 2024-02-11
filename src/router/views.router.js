import express from "express";
import authorizeRole from "../config/auth.mongo.config.js";
import { uploadProfilePhoto, uploadProductImage, uploadDocuments } from '../controllers/users.controller.js';
import __dirname from "../utils.js";
import path from "path"
import { loginUser, registerUser } from '../controllers/users.controller.js';
import { generateToken } from '../services/authJWTService.js';
import UserRouter from "./user.router.js";

const ViewsRouter = express.Router()

ViewsRouter.get("/", async (req, res) => {
    res.sendFile(path.join(__dirname, 'main.html'))
})

ViewsRouter.get("/inicio", async (req, res) => {
    res.render("inicio", {
        title: "Ecommerce",
    })
})

ViewsRouter.get("/register", (req, res) => {
    res.render("register", {
        title: "Registro de Usuario"
    })
})

ViewsRouter.get("/login", (req, res) => {
    res.render("login", {
        title: "Login de Usuario"
    })
})

ViewsRouter.get("/addProducts", authorizeRole("admin"), (req, res) => {
    res.render("addProducts", {
        title: "Agregar Productos"
    })
})

ViewsRouter.post('/login', loginUser)

ViewsRouter.post('/register', registerUser, (req, res) => {
    const token = generateToken(req.user);
    res.json({ token });
});

// Rutas de usuarios
ViewsRouter.use('/api/users', UserRouter);

ViewsRouter.post('/upload/profile-photo', uploadProfilePhoto);

ViewsRouter.post('/upload/product-image', uploadProductImage);

//ViewsRouter.post('/upload/document', uploadDocument);
ViewsRouter.post('/upload/document', uploadDocuments);

export default ViewsRouter