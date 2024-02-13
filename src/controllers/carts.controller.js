import CartService from '../services/CartService.js';
import ProductService from '../services/ProductService.js';
import nodeMailer from '../config/nodemailer.config.js';
import CustomError from '../services/error/customError.js';

const { sendMail } = nodeMailer;
const cartService = new CartService();
const productService = new ProductService();

export async function mostrarCarritos(req, res, next) {
    try {
        let carts = await cartService.readCarts()
        if (!carts) {
            return next(
                CustomError.createError({
                    statusCode: 404,
                    causeKey: "CART_NOT_FOUND",
                    message: "No se encontraron carritos"
                })
            )
        }
        res.send({ result: "success", payload: carts })
    }
    catch (error) {
        console.log("No se encontro carrito: ", error);
    }
}

export async function verCarrito(req, res) {
    const cartId = req.params.cid;
    const user = req.user;
    try {
        const cart = await cartService.verCarritoById(cartId)
        const products = await cartService.mostrarProductosEnCarrito(cartId);
        if (!cart) {
            return res.redirect("/api/users/login")
        }
        const formattedProducts = await Promise.all(products.map(async (product) => {
            const productData = await productService.getProductById(product.productId);
            return {
                id: product.productId,
                quantity: product.quantity,
                name: productData.name,
                thumbnail: productData.thumbnail,
                price: productData.price,
                total: productData.price * product.quantity
            };
        }))
        res.render("carts", {
            title: "Carrito",
            cartId: cartId,
            cart: cart,
            products: formattedProducts,
            user: user
        });
        res.json(cart);

    } catch (error) {
        console.error('Error al obtener el carrito:', error);
        res.status(500).json({ error: 'Error al obtener el carrito' });
    }
}


export async function crearCarrito(req, res, next) {
    let { name, description, products } = req.body;

    if (!name || !description || !products) {
        return res.send({ status: "error", error: "Valor incorrecto" })
    }

    let result = await cartService.addCart({
        name,
        description,
        products
    })
    res.send({ result: "success", payload: result })
}

export async function updateCart(req, res) {

    let { cid } = req.params;
    let cartToReplace = req.body;

    if (!cartToReplace.name || !cartToReplace.description || !cartToReplace.products) {
        if (!carts) {
            return next(
                CustomError.createError({
                    statusCode: 404,
                    causeKey: CART_NOT_UPDATED,
                    message: "El carrito no se ha podido actualizar"
                })
            )
        }
        return res.send({ status: "error", error: "Valor incorrecto" })
    }

    let result = await cartService.updateCart(cid, cartToReplace);
    res.send({ result: "success", payload: result })
}

export async function borrarCarrito(req, res) {
    let { cid } = req.params;
    try {
        let result = await cartService.borrarCarrito(cid);
        if (!result) {
            return next(
                CustomError.createError({
                    statusCode: 404,
                    causeKey: CART_NOT_DELETED,
                    message: "El carrito no se ha podido eliminar"
                })
            )
        }
        res.send({ result: "success", payload: result })

    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el carrito' });

    }
}

export async function mostrarProductosEnCarrito(req, res) {
    const cartId = req.params.cid;
    const productId = req.params.pid;

    try {
        const result = await cartService.existProductInCart(cartId, productId);
        res.send({ result: "success", payload: result })

    } catch (error) {
        //console.error('Error al obtener el producto:', error);
        res.status(500).json({ error: 'Error al obtener el producto' });
    }
}


export async function addProductInCart(req, res, next) {

    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const quantity = req.body.quantity;
        const user = req.user;
        const product = await productService.getProductById(productId);
        if (!product) {
            res.status(404).send("Producto no encontrado");
            return;
        }
        if (product.owner.toString() === user._id.toString()) {
            res.send("Este producto te pertenece, no puedes agregarlo a tu carro.");
            return;
        }
        const existProductInCart = await cartService.existProductInCart(cartId, productId);
        let result;
        if (existProductInCart) {
            result = await cartService.editarCantidadDeProducto(cartId, productId, quantity);
        }
        else {
            result = await cartService.addProductInCart(cartId, productId, quantity);
        }
        if (!result) {
            return next(
                CustomError.createError({
                    statusCode: 404,
                    causeKey: "PRODUCT_NOT_CREATED_IN_CART",
                    message: "No se pudo agregar el producto al carrito"
                })
            )
        }
        res.send({ result: "success", payload: result })

    } catch (error) {
        console.error('Error al agregar el producto:', error);
        res.status(500).json({ error: 'Error al agregar el producto' });
    }
}


export async function addToCart(req, res) {
    try {
        const { productId } = req.params;
        const { user } = req;

        const cart = await CartService.addToCart(productId, user);

        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Error al agregar el producto al carrito.' });
    }
}

export async function editarCantidadDeProducto(req, res, next) {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const newQuantity = req.body.quantity;

    try {
        const result = await cartService.editarCantidadDeProducto(cartId, productId, newQuantity);
        res.send({ result: "success", payload: result })

    } catch (error) {
        console.error('Error al actualizar el producto:', error);
        res.status(500).json({ error: 'Error al actualizar el producto' });
    }
}


export async function deleteProductInCart(req, res) {
    let cartId = req.params.cid;
    let productId = req.params.pid;

    try {
        const result = await cartService.deleteProductInCart(cartId, productId);
        res.send({ result: "success", payload: result })

    } catch (error) {
        console.error('Error al eliminar el producto:', error);
        res.status(500).json({ error: 'Error al eliminar el producto' });
    }
}

export async function comprarCarrito(req, res, next) {
    let cartId = req.session.cartId;
    try {
        const result = await cartService.comprarCarrito(cartId)
        const ticket = result.ticket;
        let productoComprado = ticket.products.map(product => product.name);
        const cart = result.cart;

        let productoNoDisponible;
        if (cart.products.length === 0) {
            productoNoDisponible = "Todos los productos disponibles";
        } else {
            productoNoDisponible = cart.products.map(product => product.name);
        } const user = req.user;
        const email = user.email;

      /*  const emailOptions = {
            from: "E-commerce",
            to: email,
            subject: "Compra realizada",
            html: `<h1>Compra exitosa</h1>
            <p>Estimado ${user.name}, se emitió la compra: ${ticket.code}, con fecha ${ticket.purchase_datetime} </p>
            <p>Productos: ${productoComprado}</p>
            <p>Monto: ${ticket.amount}</p>
            
            <p>Productos no incluidos: ${productoNoDisponible}</p>
            <p>Disfruta tu compra</p>
            `
        }*/
        await sendMail(emailOptions);
        return res.render("confirmCompra", {
            title: "Compra realizada",
            ticket: ticket.code,
            productoComprado: productoComprado,
            productoNoDisponible: productoNoDisponible,
            amount: ticket.amount,
            user: user
        });

    } catch (error) {
        console.error('No se pudo realizar la compra:', error);
        res.status(500).json({ error: 'Compra no realizada' });
    }
}
