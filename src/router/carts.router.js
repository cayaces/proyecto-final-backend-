import express from "express";
import { addProductInCart, crearCarrito, borrarCarrito, deleteProductInCart, verCarrito, mostrarCarritos, mostrarProductosEnCarrito, updateCart, editarCantidadDeProducto, comprarCarrito } from "../controllers/carts.controller.js"
import { addToCart } from '../controllers/carts.controller.js';

const CartRouter = express.Router()

CartRouter.get("/", mostrarCarritos)
CartRouter.get("/:cid", verCarrito)
CartRouter.get("/:cid/products/:pid", mostrarProductosEnCarrito)

CartRouter.post("/:cid/products/:pid", addProductInCart)
CartRouter.post("/", crearCarrito)
CartRouter.post('/add/:productId', addToCart)
CartRouter.post("/:cid/purchase", comprarCarrito)

CartRouter.put("/:cid", updateCart)
CartRouter.put("/:cid/products/:pid", editarCantidadDeProducto)

CartRouter.delete("/:cid", borrarCarrito)
CartRouter.delete("/:cid/products/:pid", deleteProductInCart)

export default CartRouter