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

// XMLHttpRequest has no stream: responseText grows while the response arrives, each progress parses what is new
function listen(xhr: XMLHttpRequest, onEvent: (event: ServerEvent) => void): () => void {
    let offset = 0;

    return () => {
        const { events, rest } = parse(xhr.responseText.slice(offset));
        offset = xhr.responseText.length - rest.length;
        events.forEach(onEvent);
    };
}

export default function run(): Promise<string> {
    let reply = '';

    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        const take = listen(xhr, ({ data }) => {
            reply += (JSON.parse(data) as Delta).text;
        });
        xhr.open('POST', `${API}/chat`);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onprogress = take;
        xhr.onload = () => {
            if (xhr.status < 200 || xhr.status >= 300) {
                reject(new Error(`${xhr.status} ${xhr.statusText}`));
                return;
            }

            take();
            resolve(reply);
        };
        xhr.onerror = () => reject(new Error('Network error'));
        xhr.send(JSON.stringify({ prompt: 'Hello world' }));
    });
}
