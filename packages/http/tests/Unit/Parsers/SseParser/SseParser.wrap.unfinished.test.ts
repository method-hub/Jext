import { describe, expect, it } from 'vitest';
import SseParser from '@Http/Parsers/SseParser';
import type { ServerEvent } from '@Http/Contract/ServerEvent';

const collect = async (events: AsyncIterable<ServerEvent>): Promise<ServerEvent[]> => {
    const received: ServerEvent[] = [];

    for await (const event of events) {
        received.push(event);
    }

    return received;
};

describe('SseParser.wrap should drop the last event', () => {
    it('when the stream ends before its blank line', async () => {
        const response = new Response('data: complete\n\ndata: cut off');
        const parser = new SseParser();

        const events = await collect(await parser.wrap(response));

        expect(events.map(({ data }) => data)).toEqual(['complete']);
    });
});
