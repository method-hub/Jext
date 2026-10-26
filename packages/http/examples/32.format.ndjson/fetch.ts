import { API } from '../api';

interface Activity {
    type: string;
    user: number;
}

export default async function run(): Promise<Activity[]> {
    const response = await fetch(`${API}/events.ndjson`);

    if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText}`);
    }

    const text = await response.text();

    return text
        .split('\n')
        .filter((line) => line.trim() !== '')
        .map((line) => JSON.parse(line) as Activity);
}
