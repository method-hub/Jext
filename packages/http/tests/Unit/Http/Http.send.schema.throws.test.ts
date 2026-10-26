import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Http from '@Http/Http';
import Root from '@Http/Root/Root';
import JsonParser from '@Http/Parsers/JsonParser';
import type { StandardSchema } from '@Http/Contract/StandardSchema';
import ValidationError from '@Http/Error/ValidationError';

describe('Http.send should return an HttpError with the thrown error as cause', () => {
    beforeEach(() => {
        vi.spyOn(globalThis, 'fetch').mockResolvedValue(
            new Response('{"id":1}', { headers: { 'Content-Type': 'application/json' } })
        );
    });

    afterEach(() => vi.restoreAllMocks());

    it('when validate throws', async () => {
        const http = new Http(new Root<unknown>().add(new JsonParser()));
        const cause = new RangeError('Broken schema');
        const schema: StandardSchema = {
            '~standard': {
                version: 1,
                vendor: 'test',
                validate: () => {
                    throw cause;
                },
            },
        };

        const { data, error } = await http.send<unknown>('https://api.example.com/users/1', {}, { schema });

        expect(data).toBeNull();
        expect(error).not.toBeInstanceOf(ValidationError);
        expect(error?.message).toBe('The schema could not validate the response');
        expect(error?.cause).toBe(cause);
    });
});
