import { afterEach, beforeEach, describe, expect, it, vi, type MockInstance } from 'vitest';
import Delivery from '@Http/Delivery/Delivery';

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
        queueMicrotask(() => {
            this.onload?.();
            this.onloadend?.();
        });
    }
}

describe('Delivery.send should send through fetch', () => {
    let original: typeof XMLHttpRequest;
    let fetch: MockInstance;

    beforeEach(() => {
        original = globalThis.XMLHttpRequest;
        globalThis.XMLHttpRequest = FakeXhr as unknown as typeof XMLHttpRequest;
        fetch = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('ok'));
    });

    afterEach(() => {
        globalThis.XMLHttpRequest = original;
        vi.restoreAllMocks();
    });

    it('when only a download listener is given', async () => {
        FakeXhr.last = null;

        await Delivery.send('/x', { method: 'POST', body: 'x' }, { onDownloadProgress: vi.fn() });

        expect(fetch).toHaveBeenCalledTimes(1);
        expect(FakeXhr.last).toBeNull();
    });
});
