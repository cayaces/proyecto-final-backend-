import express from "express";
import authorizeRole from "../config/auth.mongo.config.js";
import { uploadProfilePhoto, uploadProductImage, uploadDocuments } from '../controllers/users.controller.js';
import __dirname from "../utils.js";
import path from "path"
import { loginUser, registerUser } from '../controllers/users.controller.js';
import { generateToken } from '../services/authJWTService.js';
import UserRouter from "./user.router.js";
import { createFakeProducts } from "../config/faker.config.js";

const ViewsRouter = express.Router()

ViewsRouter.get("/inicio", async (req, res) => {
    const cartId = req.session.cartId
    const user = req.session.user || null
    res.render("inicio", {
        title: "Ecommerce",
        cartId: cartId,
        user: user
    })
})
ViewsRouter.get("/register", (req, res) => {
    const cartId = req.session.cartId || null
    const user = req.session.user || null
    res.render("register", {
        title: "Registro de Usuario",
        cartId: cartId,
        user: user
    })
})
ViewsRouter.get("/login", (req, res) => {
    const cartId = req.session.cartId
    const user = req.session.user || null
    res.render("login", {
        title: "Ingreso de Usuario",
        cartId: cartId,
        user: user
    })
})
ViewsRouter.get("/reset", (req, res) => {
    const cartId = req.session.cartId
    const user = req.session.user || null
    res.render("reset", {
        title: "Reset Password",
        cartId: cartId,
        user: user
    })
})
ViewsRouter.get("/addProducts", authorizeRole(["admin", "premium"]), (req, res) => {
    const cartId = req.session.cartId
    const user = req.session.user || null
     res.render("addProducts", {
        title: "Agregar Productos",
        cartId: cartId,
    user: user
    })
})
ViewsRouter.get("/mockingProducts", async (req, res) => {
    let products = await createFakeProducts()
    const cartId = req.session.cartId
    const user = req.session.user || null
    res.render("mockingProducts", {
        title: "Agregar Productos",
        products: products,
        cartId: cartId,
        user: user
    })
})
ViewsRouter.get("/confirmedProducts", (req, res) => {
    const cartId = req.session.cartId
    const user = req.session.user || null
    res.render("confirmedProducts", {
        title: "Connfirmacion de productos",
        products: products,
        cartId: cartId,
        user: user
    })
})
ViewsRouter.get("/documents", (req, res) => {
    const cartId = req.session.cartId
    const user = req.session.user || null

    res.render("upload", {
        title: "Subir Documentos",
        cartId: cartId,
        user: user
    })
})
ViewsRouter.post('/upload/profile-photo', uploadProfilePhoto);
ViewsRouter.post('/upload/product-image', uploadProductImage);
//ViewsRouter.post('/upload/document', uploadDocument);
ViewsRouter.post('/upload/document', uploadDocuments);

export default ViewsRouter