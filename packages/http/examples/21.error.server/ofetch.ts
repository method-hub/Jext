import { FetchError, ofetch } from 'ofetch';
import { API } from '../api';

interface Failure {
    status: number;
    body: string;
}

export default async function run(): Promise<Failure> {
    try {
        await ofetch(`${API}/reports/daily`, { retry: 0 });
    } catch (error) {
        if (error instanceof FetchError && error.response) {
            return { status: error.response.status, body: String(error.data) };
        }
        throw error;
    }

    throw new Error('The report service should be down');
}
