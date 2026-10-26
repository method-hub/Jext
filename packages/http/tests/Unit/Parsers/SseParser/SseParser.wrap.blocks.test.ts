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

describe('SseParser.wrap should yield one event per block', () => {
    it('when blocks are separated by blank lines', async () => {
        const response = new Response('data: first\n\ndata: second\n\n');
        const parser = new SseParser();

        const events = await collect(await parser.wrap(response));

        expect(events.map(({ data }) => data)).toEqual(['first', 'second']);
    });
});
