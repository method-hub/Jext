// @vitest-environment jsdom-with-fetch

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Delivery from '@Http/Delivery/Delivery';
import type { Progress } from '@Http/Contract/Progress';

class FakeXhr {
    public static last: FakeXhr | null = null;
    public static attempts = 0;
    public readonly upload: { onprogress: ((event: ProgressEvent) => void) | null } = { onprogress: null };
    public onprogress: ((event: ProgressEvent) => void) | null = null;
    public onload: (() => void) | null = null;
    public onerror: (() => void) | null = null;
    public onabort: (() => void) | null = null;
    public onloadend: (() => void) | null = null;
    public responseType = '';
    public withCredentials = false;
    public status = 200;
    public statusText = 'OK';
    public response: ArrayBuffer = new TextEncoder().encode('{"id":1}').buffer;
    public opened: string[] = [];
    public headers: string[][] = [];
    public body: unknown = null;
    public aborted = false;

    constructor() {
        FakeXhr.last = this;
    }

    public open(method: string, url: string): void {
        this.opened = [method, url];
    }

    public setRequestHeader(name: string, value: string): void {
        this.headers.push([name, value]);
    }

    public getAllResponseHeaders(): string {
        return 'content-type: application/json\r\nx-id: 7\r\n';
    }

    public abort(): void {
        this.aborted = true;
        this.onabort?.();
        this.onloadend?.();
    }

    public send(body: unknown): void {
        this.body = body;
        FakeXhr.attempts += 1;
        this.status = FakeXhr.attempts === 1 ? 503 : 200;
        this.upload.onprogress?.(new ProgressEvent('progress', { lengthComputable: true, loaded: 1, total: 1 }));
        queueMicrotask(() => {
            this.onload?.();
            this.onloadend?.();
        });
    }
}

describe('Delivery.send should report the upload of every attempt from the start', () => {
    let original: typeof XMLHttpRequest;
    beforeEach(() => {
        original = globalThis.XMLHttpRequest;
        globalThis.XMLHttpRequest = FakeXhr as unknown as typeof XMLHttpRequest;
    });

    afterEach(() => {
        globalThis.XMLHttpRequest = original;
        vi.restoreAllMocks();
    });

    it('when a PUT through XHR is repeated after a 503', async () => {
        FakeXhr.attempts = 0;
        const reports: Progress[] = [];
        const options = { retry: { limit: 1, delay: 0 }, onUploadProgress: (p: Progress): number => reports.push(p) };

        const response = await Delivery.send('/files/1', { method: 'PUT', body: 'x' }, options);

        expect(response.status).toBe(200);
        expect(FakeXhr.attempts).toBe(2);
        expect(reports).toEqual([
            { loaded: 1, total: 1, percent: 100 },
            { loaded: 1, total: 1, percent: 100 },
        ]);
    });
});
