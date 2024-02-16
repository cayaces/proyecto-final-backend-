export default class ProductDTO {
    
    constructor(product) {
        this.name = product.name || "";
        this.description = product.description || "";
        this.price = product.price || 0;
        this.category = product.category || "Otros";
        this.stock = product.stock || 0;
        this.thumbnail = product.thumbnail || "";
        this.owner = product.owner || "";
        this._id = product._id.toString() || "";
    }
}