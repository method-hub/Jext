import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Http from '@Http/Http';
import Root from '@Http/Root/Root';
import TextParser from '@Http/Parsers/TextParser';
import type { ServerEvent } from '@Http/Contract/ServerEvent';

describe('Http.sse should parse data of every event as JSON', () => {
    beforeEach(() => {
        vi.spyOn(globalThis, 'fetch').mockResolvedValue(
            new Response('data: {"text":"Hel"}\n\ndata: {"text":"lo"}\n\n', {
                headers: { 'Content-Type': 'text/event-stream' },
            })
        );
    });

    afterEach(() => vi.restoreAllMocks());

    it('when json is called', async () => {
        const http = new Http(new Root<string>().add(new TextParser()));
        const received: Array<ServerEvent<{ text: string }>> = [];

        for await (const event of http.sse('https://api.example.com/chat').json<{ text: string }>()) {
            received.push(event);
        }

        expect(received.map(({ data }) => data.text)).toEqual(['Hel', 'lo']);
    });
});
