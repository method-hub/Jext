import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Bootstrap from '@Http/Bootstrap';
import type { ServerEvent } from '@Http/Contract/ServerEvent';

describe('Bootstrap chain should return an async iterable of events', () => {
    beforeEach(() => {
        vi.spyOn(globalThis, 'fetch').mockResolvedValue(
            new Response('data: tick\n\n', { headers: { 'Content-Type': 'text/event-stream' } })
        );
    });

    afterEach(() => vi.restoreAllMocks());

    it('when Content-Type is text/event-stream', async () => {
        const http = new Bootstrap().init();

        const { data: events } = await http.send<AsyncIterable<ServerEvent>>('https://api.example.com/events');
        const received: ServerEvent[] = [];
        for await (const event of events) {
            received.push(event);
        }

        expect(received).toEqual([{ event: 'message', data: 'tick', id: '', retry: null }]);
    });
});
