import { API } from '../api';

export default async function run(): Promise<string> {
    const response = await fetch(`${API}/robots.txt`);

    if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText}`);
    }

    return response.text();
}
