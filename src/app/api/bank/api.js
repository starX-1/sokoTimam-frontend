import instance from "../../Hooks/axios";

class Accounts {
    async getAccounts() {
        try {
            const response = await instance.get('/bank')
            return response.data
        } catch (error) {
            console.log(error)
        }
    }
    async createAccount(data) {
        try {
            const response = await instance.post('/bank/account', data)
            return response.data
        } catch (error) {
            console.log(error)
        }
    }
    async deleteAccount(id) {
        try {
            const response = await instance.delete(`/bank/${id}`)
            return response.data
        } catch (error) {
            console.log(error)
        }
    }
}


export default new Accounts