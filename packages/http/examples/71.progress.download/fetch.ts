import { API } from '../api';

interface Download {
    size: number;
    percent: number;
}

// Reads the body chunk by chunk and counts the bytes against Content-Length
async function count(
    body: ReadableStream<Uint8Array>,
    total: number,
    onPercent: (percent: number) => void
): Promise<number> {
    const reader = body.getReader();
    let loaded = 0;

    for (let chunk = await reader.read(); !chunk.done; chunk = await reader.read()) {
        loaded += chunk.value.byteLength;
        onPercent(Math.floor((loaded / total) * 100));
    }

    return loaded;
}

export default async function run(): Promise<Download> {
    let percent = 0;
    const response = await fetch(`${API}/download`);

    if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText}`);
    }
    const total = Number(response.headers.get('Content-Length'));

    const size = await count(response.body, total, (value) => {
        percent = value;
    });

    return { size, percent };
}
