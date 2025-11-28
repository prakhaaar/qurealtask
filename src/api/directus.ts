import axios from "axios";

export const directus = axios.create({
  baseURL: import.meta.env.VITE_DIRECTUS_URL,
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_DIRECTUS_TOKEN}`,
  },
});
