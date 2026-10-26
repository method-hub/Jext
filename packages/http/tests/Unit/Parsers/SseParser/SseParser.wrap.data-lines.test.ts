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

describe('SseParser.wrap should join data lines with a line break', () => {
    it('when a block has several data lines', async () => {
        const response = new Response('data: line 1\ndata: line 2\n\n');
        const parser = new SseParser();

        const events = await collect(await parser.wrap(response));

        expect(events[0].data).toBe('line 1\nline 2');
    });
});
