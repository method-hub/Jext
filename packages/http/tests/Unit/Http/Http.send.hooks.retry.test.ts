import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Http from '@Http/Http';
import Root from '@Http/Root/Root';
import TextParser from '@Http/Parsers/TextParser';

describe('Http.send should run each hook once', () => {
    beforeEach(() => {
        vi.spyOn(globalThis, 'fetch')
            .mockResolvedValueOnce(new Response(null, { status: 503 }))
            .mockResolvedValueOnce(new Response('ok'));
    });

    afterEach(() => vi.restoreAllMocks());

    it('when the request is retried once', async () => {
        const before = vi.fn();
        const after = vi.fn();
        const http = new Http(new Root<string>().add(new TextParser())).extend({
            hooks: { beforeRequest: [before], afterResponse: [after] },
        });

        const result = await http.get<string>('https://api.example.com/users').retry({ limit: 1, delay: 0 });

        expect(result).toEqual({ data: 'ok', error: null });
        expect(before).toHaveBeenCalledTimes(1);
        expect(after).toHaveBeenCalledTimes(1);
    });
});
