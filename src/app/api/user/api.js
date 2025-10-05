import instance from "../../Hooks/axios";

class Users {
    async getAll(user) {
        try {
            // console.log(user.user.accessToken, "user token")
            const response = await instance.get('/user', {
                headers: {
                    Authorization: `Bearer ${user.user.accessToken}`
                }
            })
            return response.data
        } catch (error) {
            console.log(error)
            return null
        }
    }
    async getUserById(id) {
        try {
            const response = await instance.get(`/user/${id}`)
            return response.data
        } catch (error) {
            console.log(error)
            return null
        }
    }
    async updateUser(id, data) {
        try {
            const response = await instance.put(`/user/${id}`, data)
            return response.data
        } catch (error) {
            console.log(error)
            return null
        }
    }
    async deleteUser(id) {
        try {
            const response = await instance.delete(`/user/${id}`)
            return response.data
        } catch (error) {
            console.log(error)
            return null
        }
    }
}

export default new Users();