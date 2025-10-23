import instance from "../../Hooks/axios";

class Cart {
    async addToCart(data){
        const response = await instance.post('/cart')
    }
}