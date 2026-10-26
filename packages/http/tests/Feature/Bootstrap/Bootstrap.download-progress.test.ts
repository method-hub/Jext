import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Bootstrap from '@Http/Bootstrap';
import type { Progress } from '@Http/Contract/Progress';

describe('Bootstrap client should report the download and decode the JSON', () => {
    beforeEach(() => {
        vi.spyOn(globalThis, 'fetch').mockResolvedValue(
            new Response('[{"id":1},{"id":2}]', {
                headers: { 'Content-Type': 'application/json', 'Content-Length': '19' },
            })
        );
    });

    afterEach(() => vi.restoreAllMocks());

    it('when onDownloadProgress is chained', async () => {
        const http = new Bootstrap().init();
        const reports: Progress[] = [];

        const { data } = await http
            .get<Array<{ id: number }>>('https://api.example.com/users')
            .onDownloadProgress((progress) => reports.push(progress));

        expect(data).toEqual([{ id: 1 }, { id: 2 }]);
        expect(reports[reports.length - 1]).toEqual({ loaded: 19, total: 19, percent: 100 });
    });
});
