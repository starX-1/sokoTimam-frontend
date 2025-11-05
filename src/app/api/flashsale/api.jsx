import instance from "../../Hooks/axios";

class FlashSales {
    async getFlashSales() {
        const response = await instance.get('/flashsales');
        return response.data;
    }
    async createFlashSale(data) {
        const response = await instance.post('/flashsales', data);
        return response.data;
    }
    async getSellerFlashSales(id, accessToken) {
        const response = await instance.get(`/flashsales/seller/${id}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
        return response.data
    }
    async updateFlashSale(data, accessToken) {
        const response = await instance.put(`/flashsales/${data.id}`, data, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
        return response.data
    }
    async deleteFlashSale(id, accessToken) {
        const response = await instance.delete(`/flashsales/${id}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
        return response.data
    }

}

export default new FlashSales();