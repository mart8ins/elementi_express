module.exports = class Cart {
    constructor(oldCart) {
        this.products = oldCart.products;
        this.cartTotals = oldCart.cartTotals;

        this.add = (product, quantity) => {
            let addedProduct = this.products[product._id];
            if (!addedProduct) {
                addedProduct = this.products[product._id] = { brand: product.brand, model: product.model, quantity: quantity, price: product.price.new, total: product.price.new * quantity };
                if (this.cartTotals) {
                    this.cartTotals.quantity = this.cartTotals.quantity + quantity;
                    this.cartTotals.price = this.cartTotals.price + (product.price.new * quantity);
                } else {
                    this.cartTotals = {
                        quantity: quantity,
                        price: product.price.new * quantity
                    }
                }
            } else {
                this.products[product._id].quantity = this.products[product._id].quantity + quantity;
                this.products[product._id].total = this.products[product._id].quantity * this.products[product._id].price;
                this.cartTotals.quantity = this.cartTotals.quantity + quantity;
                this.cartTotals.price = this.cartTotals.price + (product.price.new * quantity);
            }
        }

        this.remove = (id) => {
            this.cartTotals.quantity = this.cartTotals.quantity - this.products[id].quantity;
            this.cartTotals.price = this.cartTotals.price - (this.products[id].quantity * this.products[id].price);
            delete this.products[id];
        }
    }
}