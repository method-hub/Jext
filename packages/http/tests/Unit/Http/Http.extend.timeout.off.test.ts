import { afterEach, beforeEach, describe, expect, it, vi, type MockInstance } from 'vitest';
import Http from '@Http/Http';
import Root from '@Http/Root/Root';
import TextParser from '@Http/Parsers/TextParser';

describe('Http.extend should not limit the request', () => {
    let fetch: MockInstance;

    beforeEach(() => {
        fetch = vi.spyOn(globalThis, 'fetch').mockImplementation(() => Promise.resolve(new Response('ok')));
    });

    afterEach(() => vi.restoreAllMocks());

    it('when the request turns the timeout off with timeout(0)', async () => {
        const http = new Http(new Root<string>().add(new TextParser()));
        const api = http.extend({ timeout: 20 });

        await api.get<string>('/report').timeout(0);

        const [[, init]] = fetch.mock.calls as Array<[string, RequestInit]>;
        expect(init.signal).toBeNull();
    });
});
