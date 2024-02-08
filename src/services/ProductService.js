import ProductRepository from "../repositories/products.repository.js";
import ProductModel from '../dao/mongo/product.model.js';
import EmailService from "../config/nodemailer.config.js"
class ProductService {
    constructor() {
        this.productRepository = new ProductRepository();
    }

    getProducts = async (limit) => {
        try {
            const products = await this.productRepository.getProducts(limit);
            return products;

        } catch (error) {
            console.error('Error al buscar los productos:', error);
            return null;
        }
    }

    createProduct = async ({ name, description, price, owner, userEmail }) => {
        try {
            const ownerId = owner ? owner._id : 'admin';
             const newProduct = await ProductModel.create({ name, description, price, owner: ownerId });
             if (owner && owner.role === 'premium') {
                await this.sendPremiumUserEmail(userEmail, newProduct.name);
            }

            return newProduct;
        } catch (error) {
            console.log("Error al agregar producto: ", error);
            throw new Error("Error al agregar producto");
        }
    }


    sendPremiumUserEmail = async (userEmail, productName) => {
        try {
            const subject = 'Nuevo Producto Creado';
            const html = `
                <p>Hola Usuario Premium,</p>
                <p>Te informamos que se ha creado un nuevo producto: ${productName}.</p>
                <p>¡Gracias por ser un usuario premium!</p>
            `;

            await EmailService.sendEmail(userEmail, subject, html);
        } catch (error) {
            console.log("Error al enviar el correo electrónico premium: ", error);
            throw new Error("Error al enviar el correo electrónico premium");
        }
    }

    addProduct = async (product) => {
        try {
            const newProduct = await this.productRepository.addProduct(product);
            return newProduct;

        } catch (error) {
            console.error('No se pudo guardar el producto:', error);
            return null;
        }
    }

    getProductById = async (productId) => {
        try {

            const product = await this.productRepository.getProductById(productId);
            if (!product) {
                return null;
            }
            return product;

        } catch (error) {
            console.error('Error al buscar el producto por ID:', error);
            return null;
        }
    }

    updateProduct = async (id, product) => {
        try {
            const updatedProduct = await this.productRepository.updateProduct(id, product);
            return updatedProduct;

        } catch (error) {
            console.error('Error al actualizar el producto:', error);
            return null;
        }
    }

    deleteProduct = async (productId) => {
        try {
            const deletedProduct = await this.productRepository.deleteProduct(productId);
            return deletedProduct;

        } catch (error) {
            console.error('Error al eliminar el producto:', error);
            return null;
        }
    }

    checkUserPermission = (user) => {
        if (user.role !== 'admin') {
           throw new Error('No tienes permisos de administrador para realizar esta acción.');
       }
   }

    getProductByLimit = async (limit) => {
        try {
            const products = await this.productRepository.getProductByLimit(limit);
            return products;

        } catch (error) {
            console.error('Error al buscar los productos:', error);
            return null;
        }
    }

    getProductByPage = async (page) => {
        try {
            const products = await this.productRepository.getProductByPage(page);
            return products;

        } catch (error) {
            console.error('Error al buscar los productos:', error);
            return null;
        }
    }

    getProductByQuery = async (query) => {
        try {
            const products = await this.productRepository.getProductByQuery(query);
            return products;

        } catch (error) {
            console.error('Error al buscar los productos:', error);
            return null;
        }
    }

    getProductMaster = async (page, limit, category, availability, sortOrder) => {
        try {
            const products = await this.productRepository.getProductMaster(page, limit, category, availability, sortOrder);
            return products;
            
        } catch (error) {
            console.error('Error al buscar los productos:', error);
            return null;
        }
    }
}

export default ProductService



