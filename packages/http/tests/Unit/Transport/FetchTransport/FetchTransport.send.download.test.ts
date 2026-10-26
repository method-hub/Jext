import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import FetchTransport from '@Http/Transport/FetchTransport';
import type { Progress } from '@Http/Contract/Progress';

describe('FetchTransport.send should report the download progress', () => {
    beforeEach(() => {
        vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('hello', { headers: { 'Content-Length': '5' } }));
    });

    afterEach(() => vi.restoreAllMocks());

    it('when the body is read and Content-Length is known', async () => {
        const reports: Progress[] = [];

        const response = await new FetchTransport((progress) => reports.push(progress)).send('/x', {});
        const text = await response.text();

        expect(text).toBe('hello');
        expect(reports).toEqual([{ loaded: 5, total: 5, percent: 100 }]);
    });
});
