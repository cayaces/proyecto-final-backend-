import CartService from '../services/CartService.js';
const cartService = new CartService();


export async function getCarts(req, res) {
    try {
        let carts = await cartService.readCarts();
        res.send({ result: "success", payload: carts })
    }
    catch (error) {
        console.log("Cannot get carts with mongoose: ", error);
    }
}


export async function getCart(req, res) {
    const cartId = req.params.cid;

    try {
        const cart = await cartService.getCartById(cartId);
        if (!cart) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }
        res.json(cart);

    } catch (error) {
        console.error('Error al obtener el carrito:', error);
        res.status(500).json({ error: 'Error al obtener el carrito' });
    }
}


export async function createCart(req, res) {
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
        return res.send({ status: "error", error: "Valor incorrecto" })
    }

    let result = await cartService.updateCart(cid, cartToReplace);
    res.send({ result: "success", payload: result })
}


export async function deleteCart(req, res) {
    let { cid } = req.params;
    let result = await cartService.deleteCart(cid);
    res.send({ result: "success", payload: result })
}


export async function getProductsInCart(req, res) {
    const cartId = req.params.cid;
    const productId = req.params.pid;

    try {
        const result = await cartService.existProductInCart(cartId, productId);
        res.send({ result: "success", payload: result })

    } catch (error) {
        console.error('Error al obtener el producto:', error);
        res.status(500).json({ error: 'Error al obtener el producto' });
    }
}


export async function addProductInCart(req, res) {
    const cartId = req.params.cid;
    const productId = req.params.pid;

    try {
        const result = await cartService.addProductInCart(cartId, productId);
        res.send({ result: "success", payload: result })

    } catch (error) {
        console.error('Error al agregar el producto:', error);
        res.status(500).json({ error: 'Error al agregar el producto' });
    }
}


export async function updateQuantityOfProduct(req, res) {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const newQuantity = req.body.quantity;

    try {
        const result = await cartService.updateQuantityOfProduct(cartId, productId, newQuantity);
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


export async function purchaseCart(req, res) {

    let cartId = req.params.cid;

    try {
        const result = await cartService.purchaseCart(cartId);
        res.send({ result: "success", payload: result })

    } catch (error) {
        console.error('No se pudo realizar la compra:', error);
        res.status(500).json({ error: 'No se pudo realizar la compra' });
    }
}