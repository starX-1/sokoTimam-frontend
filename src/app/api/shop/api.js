// import { headers } from "next/headers";
import instance from "../../Hooks/axios";

class Shops {
    async createShop(data) {
        const response = await instance.post('/shop',
            data, // 1. The data (request body)
            { // 2. The config object (third argument)
                headers: {
                    Authorization: `Bearer ${data.accessToken}` // Correctly placed in headers
                }
            }
        );
        return response.data;
    }
    async getAllShops(accessToken) {
        const response = await instance.get('/shop',
            {
                headers: {
                    Authorization: `Bearer ${accessToken}` // Correctly placed in headers
                }
            }
        );
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