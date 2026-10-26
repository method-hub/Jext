import { afterEach, beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import Http from '@Http/Http';
import Root from '@Http/Root/Root';
import JsonParser from '@Http/Parsers/JsonParser';
import type { StandardSchema } from '@Http/Contract/StandardSchema';

describe('Http.send should not call the schema', () => {
    let validate: Mock;

    beforeEach(() => {
        validate = vi.fn();
        vi.spyOn(globalThis, 'fetch').mockResolvedValue(
            new Response('{broken', { headers: { 'Content-Type': 'application/json' } })
        );
    });

    afterEach(() => vi.restoreAllMocks());

    it('when the body cannot be decoded', async () => {
        const http = new Http(new Root<unknown>().add(new JsonParser()));
        const schema: StandardSchema = { '~standard': { version: 1, vendor: 'test', validate } };

        const { error } = await http.send<unknown>('https://api.example.com/users/1', {}, { schema });

        expect(validate).not.toHaveBeenCalled();
        expect(error?.message).toBe('The response body could not be decoded');
    });
});
