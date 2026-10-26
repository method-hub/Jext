import { http } from '@metapraxis/jext-http';
import { API } from '../api';

interface Failure {
    status: number;
    body: string;
}

export default async function run(): Promise<Failure> {
    const { error } = await http.get<unknown, string>(`${API}/reports/daily`);

    if (!error) {
        throw new Error('The report service should be down');
    }

    return { status: error.status, body: error.data ?? '' };
}
