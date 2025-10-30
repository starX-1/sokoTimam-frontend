import instance from "../../Hooks/axios";

class Orders {

    async getOrders() {
        const response = await instance.get('/orders');
        return response.data;
    }

    async getOrderById(orderId) {
        const response = await instance.get(`/orders/${orderId}`);
        return response.data;
    }
    async getOrdersByUserId(userId) {
        const response = await instance.get(`/order/user/${userId}`);
        return response.data;
    }
}

export default new Orders();