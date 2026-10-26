import { API } from '../api';

interface Failure {
    status: number;
    body: string;
}

export default async function run(): Promise<Failure> {
    const response = await fetch(`${API}/reports/daily`);

    if (response.ok) {
        throw new Error('The report service should be down');
    }

    return { status: response.status, body: await response.text() };
}
