import mongoose from "mongoose";

const productCollection = "products";

const productSchema = new mongoose.Schema({
    name: { type: String, required: true, max: 100 },
    description: { type: String, required: true, max: 100 },
    price: { type: Number, required: true },
    category: { type: String, required: true, max: 100 },
    stock: { type: Number, required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'users', default: 'admin', required: true }
})

const productModel = mongoose.model(productCollection, productSchema);

export default productModel;
