import axios from "axios";
import Cookies from "js-cookie";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL as string,
  headers: {
    "Content-Type": "application/json",
    Authorization: "Bearer " + Cookies.get("auth-token"),
  },
});

export default api;
