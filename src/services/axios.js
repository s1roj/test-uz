import axios from "axios";
import router from "@/router";

export const api = axios.create({
  baseURL: "http://localhost:3100",
});

export const studentApi = axios.create({
  baseURL: "https://student.tdmau.uz/rest",
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const status = error.response.status;

      // 🔴 TOKEN ESKIRGAN / INVALID
      if (status === 401 || status === 403) {
        console.warn("Token eskirgan yoki noto‘g‘ri. Logout qilinyapti.");

        localStorage.clear();

        // login sahifaga majburiy yo‘naltirish
        router.replace({ name: "login" });
      }
    }

    return Promise.reject(error);
  }
);
