import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Bootstrap from '@Http/Bootstrap';
import type { ServerEvent } from '@Http/Contract/ServerEvent';

describe('Bootstrap client should stream server events through http.sse', () => {
    beforeEach(() => {
        vi.spyOn(globalThis, 'fetch').mockResolvedValue(
            new Response('retry: 3000\nid: 9\nevent: tick\ndata: 1\n\n', {
                headers: { 'Content-Type': 'text/event-stream; charset=utf-8' },
            })
        );
    });

    afterEach(() => vi.restoreAllMocks());

    it('when the server answers with text/event-stream', async () => {
        const http = new Bootstrap().init();
        const received: ServerEvent[] = [];

        for await (const event of http.sse('https://api.example.com/events')) {
            received.push(event);
        }

        expect(received).toEqual([{ event: 'tick', data: '1', id: '9', retry: 3000 }]);
    });
});
