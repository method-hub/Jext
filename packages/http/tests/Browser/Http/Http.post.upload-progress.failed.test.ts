import { describe, expect, it } from 'vitest';
import Bootstrap from '@Http/Bootstrap';
import type { Progress } from '@Http/Contract/Progress';

describe('Http.post should return HttpError after the upload in a real browser', () => {
    it('when the server answers 500 to a body sent through XMLHttpRequest', async () => {
        const http = new Bootstrap().init();
        const body = 'x'.repeat(64 * 1024);
        const reports: Progress[] = [];

        const { data, error } = await http
            .post<{ received: number }>('/__test/echo?status=500')
            .body(body)
            .onUploadProgress((progress) => reports.push(progress));

        expect(data).toBeNull();
        expect(error).toMatchObject({ name: 'HttpError', status: 500 });
        expect(reports[reports.length - 1]).toEqual({ loaded: body.length, total: body.length, percent: 100 });
    });
});
