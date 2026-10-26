import { http } from '@metapraxis/jext-http';
import { API } from '../api';

interface Delta {
    text: string;
}

export default async function run(): Promise<string> {
    // A body makes the stream a POST; EventSource can send neither a body nor headers
    const chat = http.sse(`${API}/chat`).body({ prompt: 'Hello world' }).json<Delta>();
    let reply = '';

    for await (const { data } of chat) {
        reply += data.text;
    }

    return reply;
}
