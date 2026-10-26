import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Http from '@Http/Http';
import Root from '@Http/Root/Root';
import TextParser from '@Http/Parsers/TextParser';

describe('Http.send should name the status in the error message', () => {
    beforeEach(() => {
        vi.spyOn(globalThis, 'fetch').mockResolvedValue(
            new Response('', { status: 503, statusText: 'Service Unavailable' })
        );
    });

    afterEach(() => vi.restoreAllMocks());

    it('when the server answers with an error status', async () => {
        const http = new Http(new Root<string>().add(new TextParser()));

        const { error } = await http.send<string>('https://api.example.com/text');

        expect(error?.message).toBe('503 Service Unavailable');
    });
});
