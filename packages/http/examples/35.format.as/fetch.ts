import { API } from '../api';

interface Settings {
    theme: string;
    language: string;
}

export default async function run(): Promise<Settings> {
    const response = await fetch(`${API}/settings`);

    if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText}`);
    }

    return (await response.json()) as Settings;
}
