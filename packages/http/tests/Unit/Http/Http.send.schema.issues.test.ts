import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Http from '@Http/Http';
import Root from '@Http/Root/Root';
import JsonParser from '@Http/Parsers/JsonParser';
import type { StandardSchema } from '@Http/Contract/StandardSchema';
import ValidationError from '@Http/Error/ValidationError';

describe('Http.send should return a ValidationError with the issues', () => {
    beforeEach(() => {
        vi.spyOn(globalThis, 'fetch').mockResolvedValue(
            new Response('{"id":"1"}', { headers: { 'Content-Type': 'application/json' } })
        );
    });

    afterEach(() => vi.restoreAllMocks());

    it('when the data does not pass the schema', async () => {
        const http = new Http(new Root<unknown>().add(new JsonParser()));
        const issues = [{ message: 'Expected number', path: ['id'] }];
        const schema: StandardSchema = { '~standard': { version: 1, vendor: 'test', validate: () => ({ issues }) } };

        const { data, error } = await http.send<unknown>('https://api.example.com/users/1', {}, { schema });

        expect(data).toBeNull();
        expect(error).toBeInstanceOf(ValidationError);
        expect(error).toMatchObject({ issues, value: { id: '1' }, status: 200, message: 'id: Expected number' });
    });
});
