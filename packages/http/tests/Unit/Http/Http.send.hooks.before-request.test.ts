import { afterEach, beforeEach, describe, expect, it, vi, type MockInstance } from 'vitest';
import Http from '@Http/Http';
import Root from '@Http/Root/Root';
import TextParser from '@Http/Parsers/TextParser';

describe('Http.send should send the request returned by the beforeRequest hook', () => {
    let fetch: MockInstance;

    beforeEach(() => {
        fetch = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('ok'));
    });

    afterEach(() => vi.restoreAllMocks());

    it('when the hook adds a header', async () => {
        const http = new Http(new Root<string>().add(new TextParser())).extend({
            hooks: {
                beforeRequest: [
                    ({ url, init }) => {
                        const headers = new Headers(init.headers);
                        headers.set('Authorization', 'Bearer t');
                        return { url, init: { ...init, headers } };
                    },
                ],
            },
        });

        await http.get<string>('https://api.example.com/users');

        const [[, init]] = fetch.mock.calls as Array<[string, RequestInit]>;
        expect(new Headers(init.headers).get('Authorization')).toBe('Bearer t');
    });
});
