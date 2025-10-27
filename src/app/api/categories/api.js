import instance from "../../Hooks/axios";

class Categories {

  async getCategories() {
    const response = await instance.get("/category");
    return response.data;
  }

  async getCategoryById(id) {
    const response = await instance.get(`/category/${id}`);
    return response.data;
  }

  async createCategory(category, accessToken) {
    const response = await instance.post("/category", category, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      }
    });
    return response.data;
  }

  async updateCategory(id, category) {
    const response = await instance.put(`/categories/${id}`, category);
    return response.data;
  }

  async deleteCategory(id) {
    const response = await instance.delete(`/categories/${id}`);
    return response.data;
  }
  async getProductsByCategory(categoryId) {
    const response = await instance.get(`/products/category/${categoryId}`);
    return response.data;
  }

}

export default new Categories();