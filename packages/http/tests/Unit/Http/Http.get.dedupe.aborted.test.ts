import { afterEach, beforeEach, describe, expect, it, vi, type MockInstance } from 'vitest';
import Http from '@Http/Http';
import Root from '@Http/Root/Root';
import TextParser from '@Http/Parsers/TextParser';

describe('Http.get should end only the aborted request with an HttpError', () => {
    let fetch: MockInstance;

    beforeEach(() => {
        fetch = vi
            .spyOn(globalThis, 'fetch')
            .mockImplementation(() => new Promise((resolve) => setTimeout(() => resolve(new Response('ok')), 5)));
    });

    afterEach(() => vi.restoreAllMocks());

    it('when one of two shared requests is aborted', async () => {
        const http = new Http(new Root<string>().add(new TextParser()));
        const controller = new AbortController();
        const first = http.get<string>('https://api.example.com/users').dedupe().signal(controller.signal);
        const second = http.get<string>('https://api.example.com/users').dedupe();
        const pending = Promise.all([first.then((result) => result), second.then((result) => result)]);

        controller.abort();

        const [aborted, answered] = await pending;
        expect(aborted.error?.status).toBe(0);
        expect(aborted.error?.cause).toHaveProperty('name', 'AbortError');
        expect(answered).toEqual({ data: 'ok', error: null });
        expect(fetch).toHaveBeenCalledTimes(1);
    });
});
