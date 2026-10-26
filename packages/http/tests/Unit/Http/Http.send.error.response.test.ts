import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Http from '@Http/Http';
import Root from '@Http/Root/Root';
import TextParser from '@Http/Parsers/TextParser';

describe('Http.send should keep the Response in the error', () => {
    let response: Response;

    beforeEach(() => {
        response = new Response('denied', { status: 403, headers: { 'X-Request-Id': 'r-1' } });
        vi.spyOn(globalThis, 'fetch').mockResolvedValue(response);
    });

    afterEach(() => vi.restoreAllMocks());

    it('when the server answers with an error status', async () => {
        const http = new Http(new Root<string>().add(new TextParser()));

        const { error } = await http.send<string>('https://api.example.com/text');

        expect(error?.response).toBe(response);
        expect(error?.response?.headers.get('X-Request-Id')).toBe('r-1');
    });
});
