// @vitest-environment jsdom-with-fetch

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import XhrTransport from '@Http/Transport/XhrTransport';
import type { Progress } from '@Http/Contract/Progress';

class FakeXhr {
    public static last: FakeXhr | null = null;
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
        this.onprogress?.(new ProgressEvent('progress', { lengthComputable: true, loaded: 4, total: 8 }));
        queueMicrotask(() => {
            this.onload?.();
            this.onloadend?.();
        });
    }
}

describe('XhrTransport.send should report the download progress of the XHR', () => {
    let original: typeof XMLHttpRequest;
    beforeEach(() => {
        original = globalThis.XMLHttpRequest;
        globalThis.XMLHttpRequest = FakeXhr as unknown as typeof XMLHttpRequest;
    });

    afterEach(() => {
        globalThis.XMLHttpRequest = original;
        vi.restoreAllMocks();
    });

    it('when a download listener is given too', async () => {
        const reports: Progress[] = [];

        await new XhrTransport(vi.fn(), (progress) => reports.push(progress)).send('/x', {
            method: 'POST',
            body: 'x',
        });

        expect(reports).toEqual([{ loaded: 4, total: 8, percent: 50 }]);
    });
});
