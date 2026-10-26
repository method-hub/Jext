import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Http from '@Http/Http';
import Root from '@Http/Root/Root';
import TextParser from '@Http/Parsers/TextParser';

describe('Http.send should return the HttpError of the hook with the response', () => {
    beforeEach(() => {
        vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('ok', { status: 200 }));
    });

    afterEach(() => vi.restoreAllMocks());

    it('when the afterResponse hook throws', async () => {
        const http = new Http(new Root<string>().add(new TextParser())).extend({
            hooks: {
                afterResponse: [
                    () => {
                        throw new Error('log failed');
                    },
                ],
            },
        });

        const { data, error } = await http.get<string>('https://api.example.com/users');

        expect(data).toBeNull();
        expect(error).toMatchObject({ message: 'An afterResponse hook failed', status: 200 });
    });
});
