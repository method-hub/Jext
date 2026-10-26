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

describe('SseParser.wrap should ignore invalid retry and id values', () => {
    it('when retry is not a number and id contains NUL', async () => {
        const response = new Response('id: 1\n\nretry: soon\nid: a\u0000b\ndata: x\n\n');
        const parser = new SseParser();

        const events = await collect(await parser.wrap(response));

        expect(events).toEqual([{ event: 'message', data: 'x', id: '1', retry: null }]);
    });
});
