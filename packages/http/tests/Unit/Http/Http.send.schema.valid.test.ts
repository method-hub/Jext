import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Http from '@Http/Http';
import Root from '@Http/Root/Root';
import JsonParser from '@Http/Parsers/JsonParser';
import type { StandardSchema } from '@Http/Contract/StandardSchema';

describe('Http.send should return the value the schema returned', () => {
    beforeEach(() => {
        vi.spyOn(globalThis, 'fetch').mockResolvedValue(
            new Response('{"id":1}', { headers: { 'Content-Type': 'application/json' } })
        );
    });

    afterEach(() => vi.restoreAllMocks());

    it('when the data passes the schema', async () => {
        const http = new Http(new Root<unknown>().add(new JsonParser()));
        const schema: StandardSchema<unknown, { id: number; checked: boolean }> = {
            '~standard': {
                version: 1,
                vendor: 'test',
                validate: (value) => ({ value: { ...(value as { id: number }), checked: true } }),
            },
        };

        const result = await http.send<{ id: number; checked: boolean }>(
            'https://api.example.com/users/1',
            {},
            { schema }
        );

        expect(result).toEqual({ data: { id: 1, checked: true }, error: null });
    });
});
