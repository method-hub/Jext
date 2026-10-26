import { FetchError, ofetch } from 'ofetch';
import { API } from '../api';

export default async function run(): Promise<number> {
    try {
        const response = await ofetch.raw(`${API}/drop`, { retry: 0 });
        return response.status;
    } catch (error) {
        if (error instanceof FetchError) {
            return error.response?.status ?? 0;
        }
        throw error;
    }
}
