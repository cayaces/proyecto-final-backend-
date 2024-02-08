import ProductService from '../services/ProductService.js';
const productService = new ProductService();

export async function getProducts(req, res) {

    try {
        if (!req.session.email) {
            return res.redirect("/login")
        }

        let limit = parseInt(req.query.limit) || 10;
        let allProducts = await productService.getProducts(limit);

        allProducts = allProducts.map(product => product.toJSON())
        const userData = {
            name: req.session.name,
            surname: req.session.surname,
            email: req.session.email,
            role: req.session.role
        }

        res.render("home", {
            title: "Pre Entrega tres",
            products: allProducts,
            user: userData

        })

    } catch (error) {
        console.error('Error al obtener los productos:', error);
        res.status(500).json({ error: 'Error al obtener los productos' });
    }
}


export async function getProductById(req, res) {
    
    try {
        const prodId = req.params.pid;
        const prod = await productService.getProductById(prodId);

        if (!prod) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        const productDetail = prod.toObject();
        res.render("prod", {
            title: "Detalle de Producto",
            product: productDetail
        })

    } catch (error) {
        console.error('Error al obtener el producto:', error);
        res.status(500).json({ error: 'Error al obtener el producto' });
    }
}

export async function createProduct(req, res) {

    try {
        let { name, description, price, category, stock, thumbnail } = req.body;
        console.log("El body es:", req.body)

        if (!name || !description || !price || !category || !stock || !thumbnail) {
            return res.send({ status: "error", error: "Valor incorrecto" })
        }

        let result = await productService.addProduct({
            name,
            description,
            price,
            category,
            stock,
            thumbnail
        })

        res.send({ result: "success", payload: result })

    } catch (error) {
        console.error('Error al crear el producto:', error);
        res.status(500).json({ error: 'Error al crear el producto' });
    }
}


export async function updateProduct(req, res) {

    try {

        let { pid } = req.params;
        let productToReplace = req.body;

        if (!productToReplace.name || !productToReplace.description || !productToReplace.price || !productToReplace.category || !productToReplace.stock || !productToReplace.thumbnail) {
            return res.send({ status: "error", error: "Valor incompleto" })
        }

        let result = await productService.updateProduct(pid, productToReplace);
        res.send({ result: "success", payload: result })
        
    } catch (error) {
        console.error('Error al actualizar el producto:', error);
        res.status(500).json({ error: 'Error al actualizar el producto' });
    }
}

export async function deleteProduct(req, res) {

    try {
        let { pid } = req.params;
        let result = await productService.deleteProduct(pid);
        res.send({ result: "success", payload: result })

    } catch (error) {
        console.error('Error al eliminar el producto:', error);
        res.status(500).json({ error: 'Error al eliminar el producto' });
    }
}

export async function getProductByLimit(req, res) {

    try {
        let limit = parseInt(req.params.limit)
        if (isNaN(limit) || limit <= 0) {
            limit = 10
        } res.send(await productService.getProductByLimit(limit))

    } catch (error) {
        console.error('Error al obtener los productos:', error);
        res.status(500).json({ error: 'Error al obtener los productos' });
    }
}

export async function getProductByPage(req, res) {

    try {
        let page = parseInt(req.params.page)
        if (isNaN(page) || page <= 0) {
            page = 1
        }

        const productsPerPage = 1
        res.send(await productService.getProductByPage(page, productsPerPage))

    } catch (error) {
        console.error('Error al obtener los productos por pagina:', error);
        res.status(500).json({ error: 'Error al obtener los productos por pagina' });
    }
}

export async function getProductByQuery(req, res) {

    try {
        let query = req.params.query
        res.send(await productService.getProductByQuery(query))

    } catch (error) {
        console.error('Error al obtener los productos:', error);
        res.status(500).json({ error: 'Error al obtener los productos' });
    }

}

export async function getProductMaster(req, res) {

    try {
        let page = parseInt(req.params.page)
        let limit = parseInt(req.params.limit)
        let category = req.params.category
        let availability = req.params.availability
        let sortOrder = req.params.sortOrder

        if (isNaN(page) || page <= 0) {
            page = 1
        }

        if (isNaN(limit) || limit <= 0) {
            limit = 10
        }

        if (!category) {
            category = ''
        }

        if (!availability) {
            availability = ''
        }

        if (!sortOrder) {
            sortOrder = ''
        }

        res.send(await productService.getProductMaster(page, limit, category, availability, sortOrder))

    } catch (error) {
        console.error('Error al obtener los productos:', error);
        res.status(500).json({ error: 'Error al obtener los productos' });
    }
}

