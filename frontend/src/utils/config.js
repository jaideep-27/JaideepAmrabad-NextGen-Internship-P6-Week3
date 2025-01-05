export const BASE_URL = process.env.NODE_ENV === 'production' 
    ? 'https://tour-management-backend-8ubu.onrender.com/api/v1' 
    : 'http://localhost:4000/api/v1';

export const API_CONFIG = {
    credentials: 'include',
    headers: {
        'Content-Type': 'application/json',
    }
};