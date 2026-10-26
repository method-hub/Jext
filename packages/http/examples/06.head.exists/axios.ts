import axios from 'axios';
import { API } from '../api';

async function exists(id: number): Promise<boolean> {
    try {
        await axios.head(`${API}/users/${id}`);
        return true;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
            return false;
        }
        throw error;
    }
}

export default async function run(): Promise<boolean[]> {
    return [await exists(1), await exists(99)];
}
