import instance from "../../Hooks/axios";

class Categories {

  async getCategories() {
    const response = await instance.get("/categories");
    return response.data;
  }

  async getCategoryById(id) {
    const response = await instance.get(`/categories/${id}`);
    return response.data;
  }

  async createCategory(category) {
    const response = await instance.post("/categories", category);
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

}