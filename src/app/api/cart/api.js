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
        const response = await instance.delete(`/cart/items/${itemId}`);
        return response.data;
    }

    async getUserCart(userId) {
        const response = await instance.get(`/cart/with/items/${userId}`);
        return response.data;
    }
    async deleteCart(cartId) {
        const response = await instance.delete(`/cart/${cartId}`);
        return response.data;
    }
}

export default new Cart();