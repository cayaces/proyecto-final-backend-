import express from "express";
import { addProductInCart, createCart, deleteCart, deleteProductInCart, getCart, getCarts, getProductsInCart, updateCart, updateQuantityOfProduct, purchaseCart } from "../controllers/carts.controller.js";

const CartRouter = express.Router()

CartRouter.get("/", getCarts)
CartRouter.get("/:cid", getCart)
CartRouter.post("/", createCart)
CartRouter.put("/:cid", updateCart)
CartRouter.delete("/:cid", deleteCart)
CartRouter.get("/:cid/products/:pid", getProductsInCart)
CartRouter.post("/:cid/products/:pid", addProductInCart)
CartRouter.put("/:cid/products/:pid", updateQuantityOfProduct)
CartRouter.delete("/:cid/products/:pid", deleteProductInCart)
CartRouter.post("/:cid/purchase", purchaseCart)


export default CartRouter