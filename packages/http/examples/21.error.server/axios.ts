import axios from 'axios';
import { API } from '../api';

interface Failure {
    status: number;
    body: string;
}

export default async function run(): Promise<Failure> {
    try {
        await axios.get(`${API}/reports/daily`, { responseType: 'text' });
    } catch (error) {
        if (axios.isAxiosError<string>(error) && error.response) {
            return { status: error.response.status, body: error.response.data };
        }
        throw error;
    }

    throw new Error('The report service should be down');
}
