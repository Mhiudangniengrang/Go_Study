import axios from "axios";
import Cookies from "js-cookie";

const axiosClient = axios.create({
  baseURL: "https://localhost:7173",
});

axiosClient.interceptors.request.use(async (config) => {
  const access_token = await Cookies.get("__token");
  if (access_token) {
    config.headers.Authorization = `Bearer ${access_token}`;
  }
  if (config.data instanceof FormData) {
    config.headers["Content-Type"] = "multipart/form-data";
  } else {
    config.headers["Content-Type"] = "application/json";
  }
  return config;
});
export default axiosClient;
