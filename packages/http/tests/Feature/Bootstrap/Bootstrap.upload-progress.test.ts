// @vitest-environment jsdom-with-fetch

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import Bootstrap from '@Http/Bootstrap';
import type { Progress } from '@Http/Contract/Progress';

class FakeXhr {
    public readonly upload: { onprogress: ((event: ProgressEvent) => void) | null } = { onprogress: null };
    public onload: (() => void) | null = null;
    public onerror: (() => void) | null = null;
    public onabort: (() => void) | null = null;
    public onloadend: (() => void) | null = null;
    public responseType = '';
    public withCredentials = false;
    public status = 201;
    public statusText = 'Created';
    public response: ArrayBuffer = new TextEncoder().encode('{"id":9,"name":"Alice"}').buffer;

    public open(): void {}

    public setRequestHeader(): void {}

    public getAllResponseHeaders(): string {
        return 'content-type: application/json\r\n';
    }

    public abort(): void {}

    public send(): void {
        this.upload.onprogress?.(new ProgressEvent('progress', { lengthComputable: true, loaded: 8, total: 16 }));
        this.upload.onprogress?.(new ProgressEvent('progress', { lengthComputable: true, loaded: 16, total: 16 }));
        queueMicrotask(() => {
            this.onload?.();
            this.onloadend?.();
        });
    }
}

describe('Bootstrap client should report the upload and decode the answer through the chain', () => {
    let original: typeof XMLHttpRequest;

    beforeEach(() => {
        original = globalThis.XMLHttpRequest;
        globalThis.XMLHttpRequest = FakeXhr as unknown as typeof XMLHttpRequest;
    });

    afterEach(() => {
        globalThis.XMLHttpRequest = original;
    });

    it('when onUploadProgress is chained on a POST', async () => {
        const http = new Bootstrap().init();
        const reports: Progress[] = [];

        const { data } = await http
            .post<{ id: number; name: string }>('https://api.example.com/users')
            .body({ name: 'Alice' })
            .onUploadProgress((progress) => reports.push(progress));

        expect(data).toEqual({ id: 9, name: 'Alice' });
        expect(reports).toEqual([
            { loaded: 8, total: 16, percent: 50 },
            { loaded: 16, total: 16, percent: 100 },
        ]);
    });
});
