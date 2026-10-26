import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Http from '@Http/Http';
import Root from '@Http/Root/Root';
import JsonParser from '@Http/Parsers/JsonParser';
import type { StandardSchema } from '@Http/Contract/StandardSchema';

describe('Http.send should wait for the schema', () => {
    beforeEach(() => {
        vi.spyOn(globalThis, 'fetch').mockResolvedValue(
            new Response('{"id":1}', { headers: { 'Content-Type': 'application/json' } })
        );
    });

    afterEach(() => vi.restoreAllMocks());

    it('when validate returns a promise', async () => {
        const http = new Http(new Root<unknown>().add(new JsonParser()));
        const schema: StandardSchema<unknown, { id: number }> = {
            '~standard': {
                version: 1,
                vendor: 'test',
                validate: (value) => Promise.resolve({ value: value as { id: number } }),
            },
        };

        const result = await http.send<{ id: number }>('https://api.example.com/users/1', {}, { schema });

        expect(result).toEqual({ data: { id: 1 }, error: null });
    });
});
