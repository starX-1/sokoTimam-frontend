import instance from "../../Hooks/axios";

class CheckoutAPI {
    async createOrder(orderData) {
        try {
            const response = await instance.post('/order', orderData);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async updateOrder(orderId, orderData) {
        try {
            const response = await instance.put(`/checkout/update-order/${orderId}`, orderData);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async deleteOrder(orderId) {
        try {
            const response = await instance.delete(`/checkout/delete-order/${orderId}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
    async getOrder(orderId) {
        try {
            const response = await instance.get(`/checkout/get-order/${orderId}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
    async getOrders() {
        try {
            const response = await instance.get('/checkout/get-orders');
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async getOrdersByUserId(userId) {
        try {
            const response = await instance.get(`/checkout/get-orders-by-user/${userId}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
    async innitiateStkPush(stkData) {
        try {
            const response = await instance.post('/payment/stkpush', stkData);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
}

export default new CheckoutAPI();