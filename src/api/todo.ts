import { directus } from "./directus";

// Type for reading todos (what comes from API)
export type Todo = {
  id: string;
  title: string;
  content: string | null;
  is_completed: boolean;
  taggs: {
    tags_id: {
      id: number;
      name: string;
    };
  }[];
};

// Type for creating/updating todos (what we send to API)
export type TodoInput = {
  title?: string;
  content?: string | null;
  is_completed?: boolean;
  taggs?: {
    tags_id: number;
  }[];
};

export const getTodos = async (): Promise<Todo[]> => {
  const { data } = await directus.get(
    "/items/todo?fields=id,title,content,is_completed,taggs.tags_id.id,taggs.tags_id.name"
  );
  return data.data;
};

export const createTodo = async (todo: TodoInput) => {
  const { data } = await directus.post("/items/todo", todo);
  return data.data;
};

export const updateTodo = async (id: string, updated: TodoInput) => {
  const { data } = await directus.patch(`/items/todo/${id}`, updated);
  return data.data;
};

export const deleteTodo = async (id: string) => {
  await directus.delete(`/items/todo/${id}`);
  return id;
};
