import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Bootstrap from '@Http/Bootstrap';

describe('Bootstrap client should decode the answer of the repeated request', () => {
    beforeEach(() => {
        vi.spyOn(globalThis, 'fetch')
            .mockImplementationOnce(() =>
                Promise.resolve(
                    new Response('{"message":"busy"}', { status: 503, headers: { 'Content-Type': 'application/json' } })
                )
            )
            .mockImplementationOnce(() =>
                Promise.resolve(new Response('[{"id":1}]', { headers: { 'Content-Type': 'application/json' } }))
            );
    });

    afterEach(() => vi.restoreAllMocks());

    it('when the first answer is 503 and retry is on', async () => {
        const http = new Bootstrap().init();

        const result = await http
            .get<Array<{ id: number }>>('https://api.example.com/users')
            .retry({ limit: 1, delay: 0 });

        expect(result).toEqual({ data: [{ id: 1 }], error: null });
    });
});
