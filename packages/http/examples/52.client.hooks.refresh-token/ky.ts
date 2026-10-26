import ky, { HTTPError } from 'ky';
import { API } from '../api';

interface User {
    id: number;
    name: string;
}

// The token kept from an earlier session; the server no longer accepts it
let token = 'expired-token';

const api = ky.create({
    baseUrl: API,
    hooks: {
        beforeRequest: [
            ({ request }) => {
                request.headers.set('Authorization', `Bearer ${token}`);
            },
        ],
        afterResponse: [
            async ({ request, response, retryCount }) => {
                if (response.status !== 401 || retryCount > 0) {
                    return response;
                }

                ({ token } = await ky
                    .post(`${API}/login`, { body: new URLSearchParams({ username: 'alice', password: 'wonderland' }) })
                    .json<{ token: string }>());
                const headers = new Headers(request.headers);
                headers.set('Authorization', `Bearer ${token}`);
                return ky.retry({ request: new Request(request, { headers }) });
            },
        ],
    },
});

export default async function run(): Promise<string> {
    try {
        token = 'expired-token';
        const me = await api.get('/me').json<User>();

        return me.name;
    } catch (error) {
        // An error status: ky throws HTTPError with the response
        if (error instanceof HTTPError) {
            throw new Error(`${error.response.status} ${error.response.statusText}`);
        }

        throw error; // no response: the network, a timeout
    }
}
