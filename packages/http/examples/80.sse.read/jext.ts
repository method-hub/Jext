import { http } from '@metapraxis/jext-http';
import { API } from '../api';

export default async function run(): Promise<string[]> {
    const list: string[] = [];

    for await (const { data } of http.sse(`${API}/events`)) {
        list.push(data);
    }

    return list;
}
