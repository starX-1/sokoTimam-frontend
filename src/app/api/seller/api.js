import instance from "../../Hooks/axios";

class sellers{
    async getSellers(){
        const response = await instance.get('/seller')
        return response.data
    }
    async getSellerById(id){
        const response = await instance.get(`/seller/${id}`)
        return response.data
    }
    async updateSeller(id,data){
        const response = await instance.put(`/seller/${id}`,data)
        return response.data
    }
    async deleteSeller(id){
        const response = await instance.delete(`/seller/${id}`)
        return response.data
    }
    async createSeller(data){
        const response = await instance.post('/seller',data)
        return response.data
    }
}

export default new sellers();