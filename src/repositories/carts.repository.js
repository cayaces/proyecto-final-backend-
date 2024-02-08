import cartModel from "../dao/mongo/cart.model.js"
import productModel from "../dao/mongo/product.model.js"
import ticketModel from "../dao/mongo/ticket.model.js"
import { v4 as uuidv4 } from 'uuid';

class CartRepository extends cartModel {
    constructor() {
        super()
    }

    readCarts = async () => {
        try {
            const carts = await cartModel.find({});
            return carts;

        } catch (error) {
            console.error('Error al buscar los carritos:', error);
            return null;
        }
    }

    getCartById = async (cartId) => {
        try {
            const cart = await cartModel.findById(cartId).populate('products.productId');
            if (!cart) {
                return null;
            }
            return cart;

        } catch (error) {
            console.error('Error al buscar el carrito por ID:', error);
            return null;
        }
    }

    addCart = async (cart) => {
        try {
            const newCart = new cartModel(cart);
            await newCart.save();
            return newCart;

        } catch (error) {
            console.error('Error al guardar el carrito:', error);
            return null;
        }
    }

    addProductInCart = async (idCart, idProd) => {
        try {
            const filter = { _id: idCart };

            const update = {
                $setOnInsert: { _id: idCart },
                $push: { products: [{ productId: idProd, quantity: 1 }] },
            };

            const options = { upsert: true, new: true };

            const cart = await cartModel.findOneAndUpdate(filter, update, options);
            if (!cart) {
                return "Carro no encontrado";
            }
            return "Producto agregado al carrito"

        } catch (error) {
            console.error("El producto no se puede agregar", error)
            return null
        }
    }

    existProductInCart = async (idCart, idProd) => {
        try {
            const cart = await cartModel.findById(idCart);

            if (!cart) {
                return "Carito no encontrado";
            }
            const product = await productModel.findById(idProd);
            if (!product) {
                return "Producto no encontrado";
            }

            const existingProduct = Array.isArray(cart.products) && cart.products.some((product) => product.productId === idProd);
            if (existingProduct) {
                return product;
            } else {
                return null;
            }

        } catch (error) {
            console.error('Error:', error);
            return null;
        }
    }

    getProductsInCart = async (idCart) => {
        try {
            const cart = await cartModel.findById(idCart);
            if (!cart) {
                return "Carrito no encontrado";
            }
            return cart.products;

        } catch (error) {
            console.error('Error:', error);
            return null;
        }
    }

    updateQuantityOfProduct = async (idCart, idProd, quantity) => {
        try {
            const cart = await cartModel.findById(idCart);
            if (!cart) {
                return "Carrito no encontrado"
            }
            const product = await productModel.findById(idProd);
            if (!product) {
                return "Producto no encontrado";
            }

            const existingProduct = Array.isArray(cart.products) && cart.products.find((product) => product.productId.toString() === idProd);
            if (existingProduct) {
                const filter = { _id: idCart, "products.productId": idProd };
                const update = { $set: { "products.$.quantity": quantity } };
                const options = { new: true };
                const result = await cartModel.findOneAndUpdate(filter, update, options);
                return result;

            } else {
                return null;
            }

        } catch (error) {
            console.error('Error:', error);
            return null;
        }
    }

    deleteProductInCart = async (idCart, idProd) => {
        try {
            const cart = await cartModel.findById(idCart);
            if (!cart) {
                return "Carrito no encontrado";
            }

            const product = await productModel.findById(idProd);
            if (!product) {
                return "Producto no encontrado";
            }

            const productIndex = cart.products.findIndex((product) => product.productId.toString() === idProd);
            if (productIndex === -1) {
                return null;
            }

            cart.products.splice(productIndex, 1);
            await cart.save();
            return "Producto eliminado del carrito"

        } catch (error) {
            console.error('Error:', error);
            return null;
        }
    }

    existCart = async (id) => {
        try {
            const cart = await cartModel.findById(id);
            if (!cart) {
                return null;
            }

            return cart;
        } catch (error) {
            console.error('Error, el carrito no existe:', error);
            return null;
        }
    }

    getCarts = async (limit) => {

        let cartsOld = await this.readProducts()
        if (!limit) return cartsOld
        if (cartsOld.length === 0) return "Error no se encontraron carritos"
        if (cartsOld && limit) return cartsOld.slice(0, limit)
    }

    purchaseCart = async (idCart) => {
        try {
            const cart = await cartModel.findById(idCart);

            const products = cart.products;
            const productsNotAvailable = [];
            const productsAvailable = [];
            let amount = 0;

            for (const product of products) {
                const productToBuy = await productModel.findById(product.productId);

                if (!productToBuy || productToBuy.stock < product.quantity) {
                    productsNotAvailable.push(productToBuy);
                    console.log("Stock insuficiente: ", productToBuy);

                } else {
                    productsAvailable.push(productToBuy.name);
                    productToBuy.stock = productToBuy.stock - product.quantity;
                    amount = amount + productToBuy.price * product.quantity;
                    await productToBuy.save();
                }
            };

            if (!cart) {
                return "Carrito no encontrado";
            }

            const ticket = new ticketModel({
                code: uuidv4(),
                amount: amount,
                purchaser: cart.name,
                products: productsAvailable,
            })
            await ticket.save();
            cart.products = productsNotAvailable;

            return { ticket: ticket, cart: cart };
        } catch (error) {
            console.error('Error:', error);
            return null;
        }
    }
}

export default CartRepository