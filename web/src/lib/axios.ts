import axios from 'axios';

export const api = axios.create({
    baseURL: 'https://habits-production-8103.up.railway.app',
})