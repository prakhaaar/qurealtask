import { directus } from "./directus";

export type Tag = {
  id: number;
  name: string;
};

export const getTags = async (): Promise<Tag[]> => {
  const { data } = await directus.get("/items/tags?fields=id,name");
  return data.data;
};

export const createTag = async (name: string): Promise<Tag> => {
  const { data } = await directus.post("/items/tags", { name });
  return data.data;
};
