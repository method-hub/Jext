import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Http from '@Http/Http';
import Root from '@Http/Root/Root';
import TextParser from '@Http/Parsers/TextParser';
import type { Progress } from '@Http/Contract/Progress';

describe('Http.send should report the download progress and still decode the body', () => {
    beforeEach(() => {
        vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('hello', { headers: { 'Content-Length': '5' } }));
    });

    afterEach(() => vi.restoreAllMocks());

    it('when a download listener is given', async () => {
        const http = new Http(new Root<string>().add(new TextParser()));
        const reports: Progress[] = [];

        const result = await http.send<string>('/x', {}, { onDownloadProgress: (p) => reports.push(p) });

        expect(result).toEqual({ data: 'hello', error: null });
        expect(reports).toEqual([{ loaded: 5, total: 5, percent: 100 }]);
    });
});
