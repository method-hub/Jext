import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Bootstrap from '@Http/Bootstrap';
import type { StandardSchema } from '@Http/Contract/StandardSchema';

const User: StandardSchema<unknown, { id: number; name: string }> = {
    '~standard': {
        version: 1,
        vendor: 'test',
        validate: (value) => {
            const user = value as { id?: unknown; name?: unknown };

            return typeof user.id === 'number' && typeof user.name === 'string'
                ? { value: { id: user.id, name: user.name } }
                : { issues: [{ message: 'Expected { id: number, name: string }' }] };
        },
    },
};

describe('Bootstrap client should return the data validated by the schema', () => {
    beforeEach(() => {
        vi.spyOn(globalThis, 'fetch').mockResolvedValue(
            new Response('{"id":1,"name":"Alice","extra":true}', { headers: { 'Content-Type': 'application/json' } })
        );
    });

    afterEach(() => vi.restoreAllMocks());

    it('when the JSON matches the schema', async () => {
        const http = new Bootstrap().init();

        const { data } = await http.get<unknown>('https://api.example.com/users/1').schema(User);

        expect(data).toEqual({ id: 1, name: 'Alice' });
    });
});
