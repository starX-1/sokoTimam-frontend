import instance from "../../Hooks/axios";

class Cart {
    async addToCart(data) {
        const response = await instance.post('/cart', data);
        return response.data;
    }
    async getCart() {
        const response = await instance.get('/cart');
        return response.data;
    }
    async updateCartItem(itemId, data) {
        const response = await instance.put(`/cart/${itemId}`, data);
        return response.data;
    }
    async removeCartItem(itemId) {
        const response = await instance.delete(`/cart/${itemId}`);
        return response.data;
    }
    async clearCart() {
        const response = await instance.delete('/cart');
        return response.data;
    }


}

export default new Cart();