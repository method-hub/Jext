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

describe('SseParser.wrap should read event type, id and retry', () => {
    it('when the block sets them, and keep the last id for later blocks', async () => {
        const response = new Response('event: update\nid: 7\nretry: 3000\ndata: a\n\ndata: b\n\n');
        const parser = new SseParser();

        const events = await collect(await parser.wrap(response));

        expect(events).toEqual([
            { event: 'update', data: 'a', id: '7', retry: 3000 },
            { event: 'message', data: 'b', id: '7', retry: 3000 },
        ]);
    });
});
