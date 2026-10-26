import { describe, expect, it } from 'vitest';
import SseParser from '@Http/Parsers/SseParser';
import type { ServerEvent } from '@Http/Contract/ServerEvent';

const streamOf = (chunks: string[]): ReadableStream<Uint8Array> => {
    const encoder = new TextEncoder();

    return new ReadableStream({
        start(controller) {
            chunks.forEach((chunk) => controller.enqueue(encoder.encode(chunk)));
            controller.close();
        },
    });
};

const collect = async (events: AsyncIterable<ServerEvent>): Promise<ServerEvent[]> => {
    const received: ServerEvent[] = [];

    for await (const event of events) {
        received.push(event);
    }

    return received;
};

describe('SseParser.wrap should reassemble lines split across chunks', () => {
    it('when even a CRLF is split between two chunks', async () => {
        const response = new Response(streamOf(['da', 'ta: hel', 'lo\r', '\ndata: world\r\n\r', '\n']));
        const parser = new SseParser();

        const events = await collect(await parser.wrap(response));

        expect(events.map(({ data }) => data)).toEqual(['hello\nworld']);
    });
});
