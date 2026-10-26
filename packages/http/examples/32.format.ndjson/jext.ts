import { http } from '@metapraxis/jext-http';
import { API } from '../api';

interface Activity {
    type: string;
    user: number;
}

export default async function run(): Promise<Activity[]> {
    const { data, error } = await http.get<Activity[]>(`${API}/events.ndjson`);

    if (error) {
        throw error;
    }

    return data;
}
