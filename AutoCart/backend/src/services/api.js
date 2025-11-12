import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3333",
});

// Token fica só em memória
let authToken = null;

export function setToken(token) {
  authToken = token;
}

api.interceptors.request.use((config) => {
  if (authToken) {
    config.headers["Authorization"] = `Bearer ${authToken}`;
  }
  return config;
});

export default api;
