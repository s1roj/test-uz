import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:3100",
});

export const studentApi = axios.create({
  baseURL: "https://student.tdmau.uz/rest",
});
