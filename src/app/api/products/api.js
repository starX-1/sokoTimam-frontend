import instance from '../../Hooks/axios'
class Products {
    async createProduct(accessToken, data) {
        try {
            const response = await instance.post('/products', data, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": undefined
                }
            })
            return response.data
        } catch (error) {
            console.log(error)
        }
    }
    async getProducts() {
        try {
            const response = await instance.get('/product')
            return response.data
        } catch (error) {
            console.log(error)
        }
    }
    async getProductsInSHop(shopId) {
        try {
            const response = await instance.get(`/shop/${shopId}/products`)
            return response.data
        } catch (error) {
            console.log(error)
        }
    }
    async deleteProduct(id) {
        try {
            const response = await instance.delete(`/product/${id}`)
            return response.data
        } catch (error) {
            console.log(error)
        }

    }
    async updateProduct(id, data) {
        try {
            const response = await instance.put(`/product/${id}`, data)
            return response.data
        } catch (error) {
            console.log(error)
        }
    }
    async getProductWithImages(id){
        try {
            const response = await instance.get(`/product-with-images/${id}`)
            return response.data.data
        } catch (error) {
            console.error(error)
        }
    }
    async getProductImagesById(id){
        try {
            const response = await instance.get(`/product/${id}/images`)
            return response.data
        } catch (error) {
            console.error(error)
        }
    }

}

export default new Products();