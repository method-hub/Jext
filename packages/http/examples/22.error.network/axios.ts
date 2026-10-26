import axios from 'axios';
import { API } from '../api';

export default async function run(): Promise<number> {
    try {
        const response = await axios.get(`${API}/drop`);
        return response.status;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            return error.response?.status ?? 0;
        }
        throw error;
    }
}
