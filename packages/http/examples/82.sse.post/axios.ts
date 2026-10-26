import axios from 'axios';
import { API } from '../api';

interface ServerEvent {
    id: string;
    data: string;
}

interface Delta {
    text: string;
}

// A hand-written parser for the lesson: id and data fields only, no comments, retry or CRLF line ends
function parse(text: string): { events: ServerEvent[]; rest: string } {
    const blocks = text.split('\n\n');
    const rest = blocks.pop() ?? '';
    const events = blocks.map((block) => {
        const lines = block.split('\n');
        const field = (name: string): string[] =>
            lines
                .filter((line) => line.startsWith(`${name}:`))
                .map((line) => line.slice(name.length + 1).replace(/^ /u, ''));

        return { id: field('id').join(''), data: field('data').join('\n') };
    });

    return { events, rest };
}

async function* read(body: ReadableStream<Uint8Array>): AsyncGenerator<ServerEvent, void, undefined> {
    const reader = body.getReader();
    const decoder = new TextDecoder();
    let rest = '';

    for (let chunk = await reader.read(); !chunk.done; chunk = await reader.read()) {
        const { events, rest: unfinished } = parse(rest + decoder.decode(chunk.value, { stream: true }));
        rest = unfinished;
        yield* events;
    }
}

export default async function run(): Promise<string> {
    try {
        const { data: body } = await axios.post<ReadableStream<Uint8Array>>(
            `${API}/chat`,
            { prompt: 'Hello world' },
            { adapter: 'fetch', responseType: 'stream' }
        );
        let reply = '';

        for await (const { data } of read(body)) {
            reply += (JSON.parse(data) as Delta).text;
        }

        return reply;
    } catch (error) {
        // An error status: the AxiosError carries the response
        if (axios.isAxiosError(error) && error.response) {
            throw new Error(`${error.response.status} ${error.response.statusText}`);
        }

        throw error; // no response: the network, a timeout
    }
}
