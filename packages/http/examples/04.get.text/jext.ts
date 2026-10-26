import { http } from '@metapraxis/jext-http';
import { API } from '../api';

export default async function run(): Promise<string> {
    const { data, error } = await http.get<string>(`${API}/robots.txt`);

    if (error) {
        throw error;
    }

    return data;
}
