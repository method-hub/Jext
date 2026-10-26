import { afterEach, beforeEach, describe, expect, it, vi, type MockInstance } from 'vitest';
import Http from '@Http/Http';
import Root from '@Http/Root/Root';
import TextParser from '@Http/Parsers/TextParser';

describe('Http.send should return the HttpError of the hook without sending', () => {
    let fetch: MockInstance;

    beforeEach(() => {
        fetch = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('ok'));
    });

    afterEach(() => vi.restoreAllMocks());

    it('when the beforeRequest hook rejects', async () => {
        const cause = new Error('no token');
        const http = new Http(new Root<string>().add(new TextParser())).extend({
            hooks: { beforeRequest: [() => Promise.reject(cause)] },
        });

        const { data, error } = await http.get<string>('https://api.example.com/users');

        expect(data).toBeNull();
        expect(error).toMatchObject({ message: 'A beforeRequest hook failed', status: 0, cause });
        expect(fetch).not.toHaveBeenCalled();
    });
});
