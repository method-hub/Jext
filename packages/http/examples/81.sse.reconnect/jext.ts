import { http } from '@metapraxis/jext-http';
import { API } from '../api';

export default async function run(): Promise<string[]> {
    const list: string[] = [];

    // After a drop jext waits, reconnects and sends Last-Event-ID with the id of the last event
    for await (const { data } of http.sse(`${API}/ticker`).reconnect({ retries: 1, delay: 100 })) {
        list.push(data);
    }

    return list;
}
