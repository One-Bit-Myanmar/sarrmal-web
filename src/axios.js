import axis from "axios";

const instance = axis.create({
  baseURL: process.env.VUE_APP_API_BASE_URL, // fastapi url
  headers: {
    "Content-Type": "application/json",
  },
});

export default instance;
