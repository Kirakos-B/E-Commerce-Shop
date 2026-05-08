import api from "./api";
import type { Post } from "../types";

export const getPosts = async (): Promise<Post[]> => {
  const { data } = await api.get("/posts");
  return data.posts;
};

export const createPost = async (
  caption: string,
  images: string[],
): Promise<Post> => {
  const { data } = await api.post("/posts", { caption, images });
  return data.post;
};

export const likePost = async (
  id: string,
): Promise<{ liked: boolean; likesCount: number }> => {
  const { data } = await api.put(`/posts/${id}/like`);
  return data;
};

export const deletePost = async (id: string): Promise<void> => {
  await api.delete(`/posts/${id}`);
};
