import { afterEach, beforeEach, describe, expect, it, vi, type MockInstance } from 'vitest';
import Bootstrap from '@Http/Bootstrap';
import type { StandardSchema } from '@Http/Contract/StandardSchema';

describe('Bootstrap client should give each shared request its own copy of the body', () => {
    let fetch: MockInstance;

    beforeEach(() => {
        fetch = vi
            .spyOn(globalThis, 'fetch')
            .mockImplementation(
                () =>
                    new Promise((resolve) =>
                        setTimeout(
                            () =>
                                resolve(new Response('{"id":1}', { headers: { 'Content-Type': 'application/json' } })),
                            5
                        )
                    )
            );
    });

    afterEach(() => vi.restoreAllMocks());

    it('when one caller decodes as text and another validates with a schema', async () => {
        const http = new Bootstrap().init().extend({ dedupe: true });
        const User: StandardSchema<unknown, { id: number }> = {
            '~standard': { version: 1, vendor: 'test', validate: (value) => ({ value: value as { id: number } }) },
        };

        const [text, user] = await Promise.all([
            http.get('https://api.example.com/users/1').as('text'),
            http.get('https://api.example.com/users/1').schema(User),
        ]);

        expect(text).toEqual({ data: '{"id":1}', error: null });
        expect(user).toEqual({ data: { id: 1 }, error: null });
        expect(fetch).toHaveBeenCalledTimes(1);
    });
});
