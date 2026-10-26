import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Http from '@Http/Http';
import Root from '@Http/Root/Root';
import JsonParser from '@Http/Parsers/JsonParser';
import HttpError from '@Http/Error/HttpError';

describe('Http.send should return an HttpError with the decoding error as cause', () => {
    beforeEach(() => {
        vi.spyOn(globalThis, 'fetch').mockResolvedValue(
            new Response('{"id":', { headers: { 'Content-Type': 'application/json' } })
        );
    });

    afterEach(() => vi.restoreAllMocks());

    it('when a 2xx body cannot be decoded', async () => {
        const http = new Http(new Root<{ id: number }>().add(new JsonParser<{ id: number }>()));

        const { data, error } = await http.send<{ id: number }>('https://api.example.com/data');

        expect(data).toBeNull();
        expect(error).toBeInstanceOf(HttpError);
        expect(error?.status).toBe(200);
        expect(error?.data).toBeNull();
        expect(error?.cause).toHaveProperty('name', 'SyntaxError');
    });
});
