import { afterEach, describe, expect, it, vi } from 'vitest';
import Http from '@Http/Http';
import Root from '@Http/Root/Root';
import TextParser from '@Http/Parsers/TextParser';
import HttpError from '@Http/Error/HttpError';

describe('Http.send should return an HttpError with the status and no data', () => {
    afterEach(() => vi.restoreAllMocks());

    it.each([400, 401, 403, 404, 409, 422, 429, 500, 502, 503, 504])('when the status is %i', async (status) => {
        vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('failed', { status }));
        const http = new Http(new Root<string>().add(new TextParser()));

        const { data, error } = await http.send<string>('https://api.example.com/text');

        expect(data).toBeNull();
        expect(error).toBeInstanceOf(HttpError);
        expect(error?.status).toBe(status);
    });
});
