import axios from "axios";

const access_token = localStorage.getItem("access_token");

export default axios.create({
  baseURL: `https://web-youngestdev.cloud.okteto.net`,
  // baseURL: `https://builder-demo-youngestdev.cloud.okteto.net/`,
  headers: {
    "content-type": "application/json",
    "Authorization": `Bearer ${access_token}`
  }
});
