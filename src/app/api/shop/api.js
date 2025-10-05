import instance from "../../Hooks/axios";

class Shops {
    async createShop(data) {
        const response = await instance.post('/shop', data);
        return response.data;
    }
    async getAllShops() {
        const response = await instance.get('/shop');
        return response.data;

    }
    async getShopById(id) {
        const response = await instance.get(`/shop/${id}`);
        return response.data;
    }
    async updateShop(id, data) {
        const response = await instance.put(`/shop/${id}`, data);
        return response.data;
    }

}

export default new Shops();