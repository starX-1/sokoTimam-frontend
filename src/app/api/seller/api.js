import instance from "../../Hooks/axios";

class sellers {
    async getSellers() {
        const response = await instance.get('/seller')
        return response.data
    }
    async getSellerById(id) {
        const response = await instance.get(`/seller/${id}`)
        return response.data
    }
    async updateSeller(id, data) {
        const response = await instance.put(`/seller/${id}`, data)
        return response.data
    }
    async deleteSeller(id) {
        const response = await instance.delete(`/seller/${id}`)
        return response.data
    }
    async createSeller(data) {
        const response = await instance.post('/seller/register', data)
        return response.data
    }
    async adminMakeSellerVerified(id, token) {
        const response = await instance.put(`/user/${id}`, { role: 'seller' }, {
            headers: {
                Authorization: `Bearer ${token}`
            }

        })
        return response.data
    }
    async getAllMyShops(id, accessToken) {
        const response = await instance.get(`/shop/seller/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}` // Correctly placed in headers
                }
            }
        );
        return response.data;

    }
    async getSellerByUserId(id){
        const response = await instance.get(`/seller/user/${id}`)
        return response.data
    }
}

export default new sellers();