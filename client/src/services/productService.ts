import api from "./api";
import type { Product } from "../types";

interface GetProductsParams {
  keyword?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
}

interface GetProductsResponse {
  success: boolean;
  products: Product[];
  total: number;
  page: number;
  pages: number;
}

export const getProducts = async (
  params: GetProductsParams = {},
): Promise<GetProductsResponse> => {
  const { data } = await api.get("/products", { params });
  return data;
};

export const getProduct = async (id: string): Promise<Product> => {
  const { data } = await api.get(`/products/${id}`);
  return data.product;
};
