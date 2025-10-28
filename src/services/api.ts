import axios from 'axios';

export const api = axios.create({
  baseURL: 'https://api.rapdo.app',
  withCredentials: true,
});
