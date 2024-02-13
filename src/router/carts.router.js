import express from "express";
import { addProductInCart, crearCarrito, borrarCarrito, deleteProductInCart, verCarrito, mostrarCarritos, mostrarProductosEnCarrito, updateCart, editarCantidadDeProducto, comprarCarrito } from "../controllers/carts.controller.js";
import { addToCart } from '../controllers/carts.controller.js';

const CartRouter = express.Router()

CartRouter.get("/", mostrarCarritos)
CartRouter.get("/:cid", verCarrito)
CartRouter.post("/", crearCarrito)
CartRouter.put("/:cid", updateCart)
CartRouter.delete("/:cid", borrarCarrito)
CartRouter.get("/:cid/products/:pid", mostrarProductosEnCarrito)
CartRouter.post("/:cid/products/:pid", addProductInCart)
CartRouter.put("/:cid/products/:pid", editarCantidadDeProducto)
CartRouter.delete("/:cid/products/:pid", deleteProductInCart)
CartRouter.post("/:cid/purchase", comprarCarrito)
CartRouter.post('/add/:productId', addToCart);

export default CartRouter