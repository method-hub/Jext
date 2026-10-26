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

describe('SseParser.wrap should skip comments and blocks without data', () => {
    it('when the stream sends keep-alive comments and empty events', async () => {
        const response = new Response(': keep-alive\n\nevent: ping\n\ndata: real\n\n');
        const parser = new SseParser();

        const events = await collect(await parser.wrap(response));

        expect(events).toEqual([{ event: 'message', data: 'real', id: '', retry: null }]);
    });
});
