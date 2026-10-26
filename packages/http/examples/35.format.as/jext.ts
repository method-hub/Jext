import { http } from '@metapraxis/jext-http';
import { API } from '../api';

interface Settings {
    theme: string;
    language: string;
}

export default async function run(): Promise<Settings> {
    const { data, error } = await http.get<Settings>(`${API}/settings`).as('json');

    if (error) {
        throw error;
    }

    return data;
}
