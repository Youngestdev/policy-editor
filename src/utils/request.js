import axios from "axios";

export default axios.create({
  baseURL: `https://builder-demo-youngestdev.cloud.okteto.net/`,
  headers: {
    "content-type": "application/json"
  }
});
