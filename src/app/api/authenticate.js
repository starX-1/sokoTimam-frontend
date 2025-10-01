import instance from "../Hooks/axios";


class Auth {
    async register(data) {
        const response = await instance.post("user", data)
        return response.data;
    }

    async login(data) {
        const response = await instance.post("user/login", data)
        return response.data;
    }
}

const auth = new Auth();
export default auth;