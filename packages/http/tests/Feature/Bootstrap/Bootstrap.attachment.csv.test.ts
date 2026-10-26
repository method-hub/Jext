import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Bootstrap from '@Http/Bootstrap';

describe('Bootstrap chain should return an attachment as a Blob, not as rows', () => {
    beforeEach(() => {
        vi.spyOn(globalThis, 'fetch').mockResolvedValue(
            new Response('id\n1', {
                headers: { 'Content-Type': 'text/csv', 'Content-Disposition': 'attachment; filename="report.csv"' },
            })
        );
    });

    afterEach(() => vi.restoreAllMocks());

    it('when a CSV is sent with Content-Disposition: attachment', async () => {
        const http = new Bootstrap().init();

        const { data } = await http.send<Blob>('https://api.example.com/report.csv');

        expect(data).toBeInstanceOf(Blob);
    });
});
