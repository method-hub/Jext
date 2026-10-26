import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Http from '@Http/Http';
import Root from '@Http/Root/Root';
import JsonParser from '@Http/Parsers/JsonParser';
import HttpError from '@Http/Error/HttpError';

describe('Http.send should return the HttpError with null data', () => {
    beforeEach(() => {
        vi.spyOn(globalThis, 'fetch').mockResolvedValue(
            new Response('<h1>Bad Gateway</h1>', { status: 502, headers: { 'Content-Type': 'application/json' } })
        );
    });

    afterEach(() => vi.restoreAllMocks());

    it('when the error body cannot be decoded', async () => {
        const http = new Http(new Root<unknown>().add(new JsonParser<unknown>()));

        const { error } = await http.send<unknown>('https://api.example.com/data');

        expect(error).toBeInstanceOf(HttpError);
        expect(error?.status).toBe(502);
        expect(error?.data).toBeNull();
    });
});
