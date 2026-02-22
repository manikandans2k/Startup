import api from "./api";

export const getAllProducts = () => {
  return api.get("/products");
};

export const addProduct = (data) => {
  return api.post("/products", data);
};
