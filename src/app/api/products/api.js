import instance from '../../Hooks/axios'
class Products {
    async createProduct(data) {
        try {
            const response = await instance.post('/product', data)
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

}

export default new Products();