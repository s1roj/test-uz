import axios from "axios";

export const api = axios.create({
  baseURL: "https://api.tdmau.uz",
});

export const studentApi = axios.create({
  baseURL: "https://student.tdmau.uz/rest",
});
