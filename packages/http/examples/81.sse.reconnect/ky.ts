import ky, { HTTPError } from 'ky';
import { API } from '../api';

interface ServerEvent {
    id: string;
    data: string;
}

function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
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

// Reads one connection into events; resolves with true when it dropped, false when the server ended it
async function connect(events: ServerEvent[]): Promise<boolean> {
    const lastId = events[events.length - 1]?.id ?? '';
    const headers: Record<string, string> = lastId ? { 'Last-Event-ID': lastId } : {};
    const response = await ky.get(`${API}/ticker`, { headers });
    const { body } = response;

    try {
        for await (const event of read(body)) {
            events.push(event);
        }

        return false;
    } catch {
        return true;
    }
}

export default async function run(): Promise<string[]> {
    try {
        const events: ServerEvent[] = [];

        if (await connect(events)) {
            await sleep(100);
            await connect(events);
        }

        return events.map(({ data }) => data);
    } catch (error) {
        // An error status: ky throws HTTPError with the response
        if (error instanceof HTTPError) {
            throw new Error(`${error.response.status} ${error.response.statusText}`);
        }

        throw error; // no response: the network, a timeout
    }
}
