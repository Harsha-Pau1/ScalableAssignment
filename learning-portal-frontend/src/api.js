// api.js
import axios from "axios";

// API base URLs for each microservice
const API_BASE_URL_USER = "http://user-service:5001/api";
const API_BASE_URL_COURSE = "http://course-service:5002/api";
const API_BASE_URL_PROGRESS = "http://progress-service:5003/api";

export const userAPI = axios.create({ baseURL: API_BASE_URL_USER });
export const courseAPI = axios.create({ baseURL: API_BASE_URL_COURSE });
export const progressAPI = axios.create({ baseURL: API_BASE_URL_PROGRESS });
