import axios from 'axios';

const API_URL = import.meta.env.VITE_BACKEND_URL;

// Create a shared axios instance with credentials enabled
const apiClient = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add request interceptor for debugging
apiClient.interceptors.request.use(
    (config) => {
        console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, {
            withCredentials: config.withCredentials,
            params: config.params,
        });
        // Log that cookies should be included
        if (config.withCredentials) {
            console.log('  ↳ Cookies WILL be sent with this request');
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor for error handling
apiClient.interceptors.response.use(
    (response) => {
        console.log(`[API Response] ${response.config.url}`, response.data);
        // Check if Set-Cookie header is present
        const setCookie = response.headers['set-cookie'];
        if (setCookie) {
            console.log('  ↳ Cookies set by server:', setCookie);
        }
        return response;
    },
    (error) => {
        console.error(`[API Error] ${error.config?.url}`, {
            status: error.response?.status,
            message: error.response?.data?.message || error.message,
        });

        // Special handling for authentication errors
        if (error.response?.status === 401) {
            console.error('  ↳ 401 UNAUTHORIZED - Cookie not sent or invalid!');
            console.error('  ↳ Check: Application tab → Cookies → Verify "token" cookie exists');
            console.error('  ↳ Backend needs: SameSite=Lax (not None) for localhost');
        }

        return Promise.reject(error);
    }
);

export default apiClient;
