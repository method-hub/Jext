import { FetchError, ofetch } from 'ofetch';
import { API } from '../api';

interface User {
    id: number;
    name: string;
}

// The token kept from an earlier session; the server no longer accepts it
let token = 'expired-token';

const api = ofetch.create({
    baseURL: API,
    retry: 1,
    retryStatusCodes: [401],
    onRequest: ({ options }) => {
        options.headers.set('Authorization', `Bearer ${token}`);
    },
    onResponseError: async ({ response }) => {
        if (response.status === 401) {
            ({ token } = await ofetch<{ token: string }>(`${API}/login`, {
                method: 'POST',
                body: new URLSearchParams({ username: 'alice', password: 'wonderland' }),
            }));
        }
    },
});

export default async function run(): Promise<string> {
    try {
        token = 'expired-token';
        const me = await api<User>('/me');

        return me.name;
    } catch (error) {
        // An error status: ofetch throws FetchError with the response
        if (error instanceof FetchError && error.response) {
            throw new Error(`${error.response.status} ${error.response.statusText}`);
        }

        throw error; // no response: the network, a timeout
    }
}
