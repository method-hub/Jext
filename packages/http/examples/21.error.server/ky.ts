import ky, { isHTTPError } from 'ky';
import { API } from '../api';

interface Failure {
    status: number;
    body: string;
}

export default async function run(): Promise<Failure> {
    try {
        await ky.get(`${API}/reports/daily`, { retry: 0 });
    } catch (error) {
        if (isHTTPError(error)) {
            return { status: error.response.status, body: error.data as string };
        }
        throw error;
    }

    throw new Error('The report service should be down');
}
