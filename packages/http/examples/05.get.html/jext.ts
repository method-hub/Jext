import { http } from '@metapraxis/jext-http';
import { API } from '../api';

export default async function run(): Promise<string> {
    const { data: page, error } = await http.get<Document>(`${API}/about.html`);

    if (error) {
        throw error;
    }

    return page.querySelector('h1')?.textContent ?? '';
}
