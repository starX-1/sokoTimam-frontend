import instance from "../../Hooks/axios";

class Users {
    async getAll(user) {
        try {
            const response = await instance.get('/user', {
                headers: {
                    Authorization: `Bearer ${user.user.accessToken}`
                }
            })
            return response.data
        } catch (error) {
            console.error(error)
            return null
        }
    }
    async getUserById(id) {
        try {
            const response = await instance.get(`/user/${id}`)
            return response.data
        } catch (error) {
            console.error(error)
            return null
        }
    }
    async updateUser(id, data) {
        try {
            const response = await instance.put(`/user/${id}`, data)
            return response.data
        } catch (error) {
            console.error(error)
            return null
        }
    }
    async deleteUser(id) {
        try {
            const response = await instance.delete(`/user/${id}`)
            return response.data
        } catch (error) {
            console.error(error)
            return null
        }
    }
    async getUserByEmail(email) {
        try {
            const response = await instance.get(`/user/email/${email}`)
            return response.data
        } catch (error) {
            return null
        }
    }
    async forgetPassword(email) {
        try {
            const response = await instance.post('/user/forgot-password', { email })
            return response.data
        } catch (error) {
            return null
        }
    }
    async resetPassword(token, password) {
        try {
            const response = await instance.post('/user/reset-password', { token, password })
            return response.data
        } catch (error) {
            return null
        }
    }
}

export default new Users();