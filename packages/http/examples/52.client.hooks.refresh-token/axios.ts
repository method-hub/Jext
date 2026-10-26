import axios, { type InternalAxiosRequestConfig } from 'axios';
import { API } from '../api';

interface User {
    id: number;
    name: string;
}

// The token kept from an earlier session; the server no longer accepts it
let token = 'expired-token';

const api = axios.create({ baseURL: API });

api.interceptors.request.use((config) => {
    config.headers.set('Authorization', `Bearer ${token}`);
    return config;
});

api.interceptors.response.use(null, async (error: unknown) => {
    const config = axios.isAxiosError(error)
        ? (error.config as InternalAxiosRequestConfig & { retried?: boolean })
        : null;

    if (!config || config.retried || !axios.isAxiosError(error) || error.response?.status !== 401) {
        throw error;
    }

    const { data } = await axios.post<{ token: string }>(
        `${API}/login`,
        new URLSearchParams({ username: 'alice', password: 'wonderland' })
    );
    ({ token } = data);
    config.retried = true;
    return api(config);
});

export default async function run(): Promise<string> {
    try {
        token = 'expired-token';
        const { data } = await api.get<User>('/me');

        return data.name;
    } catch (error) {
        // An error status: the AxiosError carries the response
        if (axios.isAxiosError(error) && error.response) {
            throw new Error(`${error.response.status} ${error.response.statusText}`);
        }

        throw error; // no response: the network, a timeout
    }
}
