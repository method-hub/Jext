import ky, { isNetworkError } from 'ky';
import { API } from '../api';

export default async function run(): Promise<number> {
    try {
        const response = await ky.get(`${API}/drop`, { retry: 0 });
        return response.status;
    } catch (error) {
        if (isNetworkError(error)) {
            return 0;
        }
        throw error;
    }
}
