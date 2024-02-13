import CartRepository from "../repositories/carts.repository.js";

class CartService {
    constructor() {
        this.cartRepository = new CartRepository();
    }

    readCarts = async () => {
        try {
            const carts = await this.cartRepository.readCarts();
            return carts;

        } catch (error) {
            console.error('Error al buscar los carritos:', error);
            return null;
        }
    }

    addToCart = async (productId, user) => {
        try {
            const product = await ProductModel.findById(productId);
            this.checkPremiumUserPermission(user, product);

            const updatedUser = await UserModel.findByIdAndUpdate(
                user._id,
                { $addToSet: { cart: { product: productId } } },
                { new: true }
            );

            return updatedUser.cart;
        } catch (error) {
            console.error('Error al agregar el producto al carrito:', error);
            throw new Error('Error al agregar el producto al carrito');
        }
    }

    checkPremiumUserPermission = (user, product) => {
        if (user.role === 'premium' && product.owner.toString() === user._id.toString()) {
            throw new Error('No puedes agregar a tu carrito un producto que te pertenece.');
        }
    }

    addCart = async (cart) => {
        try {
            const newCart = await this.cartRepository.addCart(cart);
            return newCart;

        } catch (error) {
            console.error('Error al guardar el carrito:', error);
            return null;
        }
    }

    verCarritoById = async (cartId) => {
        try {
            const cart = await this.cartRepository.verCarritoById(cartId);

            if (!cart) {
                return null;
            }
            return cart;

        } catch (error) {
            console.error('Error al buscar el carrito por ID:', error);
            return null;
        }
    }

    addProductInCart = async (idCart, idProd) => {
        try {
            const newProduct = await this.cartRepository.addProductInCart(idCart, idProd);
            if (!newProduct) {
                return null;
            }
            return newProduct;

        } catch (error) {
            console.error('Error al guardar el producto en el carrito:', error);
            return null;
        }
    }

    existProductInCart = async (idCart, idProd) => {
        try {
            const existProductInCart = await this.cartRepository.existProductInCart(idCart, idProd);
            if (!existProductInCart) {
                return null;
            }
            return existProductInCart;

        } catch (error) {
            console.error('Error:', error);
            return null;
        }
    }

    mostrarProductosEnCarrito = async (idCart) => {
        try {
            const products = await this.cartRepository.mostrarProductosEnCarrito(idCart);
            if (!products) {
                return null;
            }
            return products;

        } catch (error) {
            console.error('Error:', error);
            return null;
        }
    }

    editarCantidadDeProducto = async (idCart, idProd, quantity) => {
        try {
            const updateQuantity = await this.cartRepository.editarCantidadDeProducto(idCart, idProd, quantity);
            if (!updateQuantity) {
                return null;
            }
            return updateQuantity;

        } catch (error) {
            console.error('Error:', error);
            return null;
        }
    }

    deleteProductInCart = async (idCart, idProd) => {
        try {
            const deleteProduct = await this.cartRepository.deleteProductInCart(idCart, idProd);
            if (!deleteProduct) {
                return null;
            }
            return deleteProduct;

        } catch (error) {
            console.error('Error:', error);
            return null;
        }
    }

    comprarCarrito = async (idCart) => {
        try {
            const purchase = await this.cartRepository.comprarCarrito(idCart);
            if (!purchase) {
                return null;
            }

        } catch (error) {
            console.error('Error:', error);
            return null;
        }
    }

}

export default CartService