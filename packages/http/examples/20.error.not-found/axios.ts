import axios from 'axios';
import { API } from '../api';

interface Problem {
    status: number;
    message: string;
}

export default async function run(): Promise<Problem> {
    try {
        await axios.get(`${API}/users/42`);
    } catch (error) {
        if (axios.isAxiosError<{ message: string }>(error) && error.response) {
            return { status: error.response.status, message: error.response.data.message };
        }
        throw error;
    }

    throw new Error('User 42 should not exist');
}
