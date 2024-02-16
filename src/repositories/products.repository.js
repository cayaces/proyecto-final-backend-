import productModel from "../dao/mongo/product.model.js";
import mongoose from "mongoose";

class ProductRepository extends productModel {
    constructor() {
        super();
    }
    readProducts = async () => {
        try {
            const products = await productModel.find({});
            return products
        } catch (error) {
            console.error('Error al buscar los productos:', error);
            return null
        }
    }

    getProducts = async (limit, page, sort, query) => {
        let newQuery = query || {};
        let paginate = { limit, page, sort }
        let products = await productModel.paginate(newQuery, paginate)
        if (!products) {
            return null;
        }
        return products;
    }

    addProduct = async (product) => {

        try {
            const newProduct = new productModel(product);
            await newProduct.save();
            return newProduct;

        } catch (error) {
            console.error('Error al guardar (repository) el producto:', error);
            return null;
        }
    }


    getProductById = async (productId) => {
        try {
            if (!mongoose.Types.ObjectId.isValid(productId)) {
                return null;
            }
            const product = await productModel.findById(productId);
            if (!product) {
                return null;
            }
            return product
        } catch (error) {
            console.error('Error al buscar el producto por ID:', error);
            return null;
        }
    }

    updateProduct = async (id, product) => {
        try {
            const updatedProduct = await productModel.findOneAndUpdate({ _id: id }, product, { new: true });
            if (updatedProduct) {
                return { updatedProduct, message: "Producto actualizado" };
            } else {
                return "Producto no encontrado";
            }
        } catch (error) {
            console.error('Error al actualizar el producto:', error);
            return null;
        }
    }

    deleteProduct = async (productId) => {
        try {
            const deletedProduct = await productModel.findByIdAndDelete(productId);
            return deletedProduct
        } catch (error) {
            console.error('Error al eliminar el producto:', error);
            return null;
        }
    }

    existProducts = async (id) => {
        try {
            const product = await productModel.findById(id);
            if (!product) {
                return null;
            }
            return product;
        } catch (error) {
            console.error('Error, el producto no existe:', error);
            return null;
        }
    }
   

}

export default ProductRepository;