import { http, type AfterResponse, type BeforeRequest } from '@metapraxis/jext-http';
import { API } from '../api';

interface User {
    id: number;
    name: string;
}

// The token kept from an earlier session; the server no longer accepts it
let token = 'expired-token';

function signed(init: RequestInit): RequestInit {
    const headers = new Headers(init.headers);
    headers.set('Authorization', `Bearer ${token}`);
    return { ...init, headers };
}

async function refresh(): Promise<void> {
    const { data, error } = await http
        .post<{ token: string }>(`${API}/login`)
        .body(new URLSearchParams({ username: 'alice', password: 'wonderland' }));

    if (error) {
        throw error;
    }

    ({ token } = data);
}

const sign: BeforeRequest = ({ url, init }) => ({ url, init: signed(init) });

const renew: AfterResponse = async (response, { url, init }) => {
    if (response.status !== 401) {
        return response;
    }

    await refresh();
    return fetch(url, signed(init));
};

const api = http.extend({ baseUrl: API, hooks: { beforeRequest: [sign], afterResponse: [renew] } });

export default async function run(): Promise<string> {
    token = 'expired-token';
    const { data, error } = await api.get<User>('/me');

    if (error) {
        throw error;
    }

    return data.name;
}
