import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Http from '@Http/Http';
import Root from '@Http/Root/Root';
import TextParser from '@Http/Parsers/TextParser';

describe('Http.send should decode the response returned by the afterResponse hook', () => {
    beforeEach(() => {
        vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('expired', { status: 401 }));
    });

    afterEach(() => vi.restoreAllMocks());

    it('when the hook replaces a 401 with another response', async () => {
        const http = new Http(new Root<string>().add(new TextParser())).extend({
            hooks: {
                afterResponse: [(response) => (response.status === 401 ? new Response('fresh') : response)],
            },
        });

        const result = await http.get<string>('https://api.example.com/users');

        expect(result).toEqual({ data: 'fresh', error: null });
    });
});
