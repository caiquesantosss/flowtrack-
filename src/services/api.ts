import axios from 'axios';

export const API_BASE_URL = 'http://192.168.1.40:8000';
export const WS_BASE_URL = 'ws://192.168.1.40:8000/ws';

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});