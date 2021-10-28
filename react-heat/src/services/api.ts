import axios from 'axios';
import { BACKEND_URL } from '../contants/urls';

export const api = axios.create({
    baseURL: BACKEND_URL,
});

