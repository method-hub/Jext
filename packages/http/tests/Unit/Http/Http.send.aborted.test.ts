import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Http from '@Http/Http';
import Root from '@Http/Root/Root';
import TextParser from '@Http/Parsers/TextParser';
import HttpError from '@Http/Error/HttpError';

describe('Http.send should return an HttpError with status 0', () => {
    beforeEach(() => {
        vi.spyOn(globalThis, 'fetch').mockRejectedValue(new DOMException('The operation was aborted.', 'AbortError'));
    });

    afterEach(() => vi.restoreAllMocks());

    it('when the request is aborted', async () => {
        const http = new Http(new Root<string>().add(new TextParser()));

        const { data, error } = await http.send<string>('https://api.example.com/text', {
            signal: AbortSignal.abort(),
        });
        expect(data).toBeNull();
        expect(error).toBeInstanceOf(HttpError);
        expect(error?.status).toBe(0);
        expect(error?.cause).toHaveProperty('name', 'AbortError');
    });
});
