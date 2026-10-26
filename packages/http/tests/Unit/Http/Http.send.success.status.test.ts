import { afterEach, describe, expect, it, vi } from 'vitest';
import Http from '@Http/Http';
import Root from '@Http/Root/Root';
import TextParser from '@Http/Parsers/TextParser';

describe('Http.send should return no error', () => {
    afterEach(() => vi.restoreAllMocks());

    it.each([200, 201, 202, 203, 206, 299])('when the status is %i', async (status) => {
        vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('ok', { status }));
        const http = new Http(new Root<string>().add(new TextParser()));

        const { data, error } = await http.send<string>('https://api.example.com/text');

        expect(error).toBeNull();
        expect(data).toBe('ok');
    });
});
