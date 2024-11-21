import axios from 'axios'

export const api = axios.create({
    baseURL: 'https://simbora-app-api.vihrcv.easypanel.host/',
})