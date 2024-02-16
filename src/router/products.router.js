import express from "express";
import { getProducts, createProduct, deleteProduct, manageProducts, getProductById, updateProduct } from "../controllers/products.controller.js";

const productsRouter = express.Router()

productsRouter.get("/", getProducts)
productsRouter.get("/:pid", getProductById)
productsRouter.get("/manageProducts", manageProducts)

productsRouter.post("/", createProduct)

productsRouter.put("/update/:pid", updateProduct)

productsRouter.delete("/delete/:pid", deleteProduct)

export default productsRouter;