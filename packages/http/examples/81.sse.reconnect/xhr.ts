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

// XMLHttpRequest has no stream: responseText grows while the response arrives, each progress parses what is new
function listen(xhr: XMLHttpRequest, onEvent: (event: ServerEvent) => void): () => void {
    let offset = 0;

    return () => {
        const { events, rest } = parse(xhr.responseText.slice(offset));
        offset = xhr.responseText.length - rest.length;
        events.forEach(onEvent);
    };
}

// Reads one connection into events; resolves with true when it dropped, false when the server ended it
function connect(events: ServerEvent[]): Promise<boolean> {
    const lastId = events[events.length - 1]?.id ?? '';

    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        const take = listen(xhr, (event) => events.push(event));
        xhr.open('GET', `${API}/ticker`);
        if (lastId) {
            xhr.setRequestHeader('Last-Event-ID', lastId);
        }
        xhr.onprogress = take;
        xhr.onload = () => {
            if (xhr.status < 200 || xhr.status >= 300) {
                reject(new Error(`${xhr.status} ${xhr.statusText}`));
                return;
            }

            take();
            resolve(false);
        };
        xhr.onerror = () => {
            take();
            resolve(true);
        };
        xhr.send();
    });
}

export default async function run(): Promise<string[]> {
    const events: ServerEvent[] = [];

    if (await connect(events)) {
        await sleep(100);
        await connect(events);
    }

    return events.map(({ data }) => data);
}
