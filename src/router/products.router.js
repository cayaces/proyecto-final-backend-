import express from "express";
import { getProducts, createProduct, deleteProduct, getProductById, getProductByLimit, getProductByPage, getProductByQuery, updateProduct } from "../controllers/products.controller.js";

const productsRouter = express.Router()

productsRouter.get("/", getProducts)
productsRouter.get("/:pid", getProductById)
productsRouter.post("/", createProduct)
productsRouter.put("/:pid", updateProduct)
productsRouter.delete("/:pid", deleteProduct)
productsRouter.get("/limit/:limit", getProductByLimit)
productsRouter.get("/page/:page", getProductByPage)
productsRouter.get("/query/:query", getProductByQuery)


export default productsRouter;