import mongoose from "mongoose"
const ticketCollection = "tickets"
const productSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'products' },
    quantity: { type: Number, required: true },
    name: { type: String, required: true }
})
const ticketSchema = new mongoose.Schema({
    code: { type: String, require: true, unique: true, max: 100 },
    purchase_datetime: { type: Date, require: true, default: Date.now() },
    amount: { type: Number, require: true },
    purchaser: { type: String, require: true, max: 100 },
    products: [productSchema],


})
const ticketModel = mongoose.model(ticketCollection, ticketSchema)
export default ticketModel