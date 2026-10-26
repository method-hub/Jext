import { describe, expect, it } from 'vitest';
import Bootstrap from '@Http/Bootstrap';
import type { Progress } from '@Http/Contract/Progress';

describe('Http.post should report the upload progress in a real browser and decode the answer', () => {
    it('when a 1 MB text body is sent through XMLHttpRequest', async () => {
        const http = new Bootstrap().init();
        const body = 'x'.repeat(1024 * 1024);
        const reports: Progress[] = [];

        const { data } = await http
            .post<{ received: number }>('/__test/echo')
            .body(body)
            .onUploadProgress((progress) => reports.push(progress));

        expect(data).toMatchObject({ received: body.length });
        expect(reports.length).toBeGreaterThan(0);
        expect(reports[reports.length - 1]).toEqual({ loaded: body.length, total: body.length, percent: 100 });
    });
});
