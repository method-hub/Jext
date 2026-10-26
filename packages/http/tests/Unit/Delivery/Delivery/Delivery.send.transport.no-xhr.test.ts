import { afterEach, beforeEach, describe, expect, it, vi, type MockInstance } from 'vitest';
import Delivery from '@Http/Delivery/Delivery';

describe('Delivery.send should fall back to fetch without calling the upload listener', () => {
    let original: typeof XMLHttpRequest;
    let fetch: MockInstance;

    beforeEach(() => {
        original = globalThis.XMLHttpRequest;
        globalThis.XMLHttpRequest = null as unknown as typeof XMLHttpRequest;
        fetch = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('ok'));
    });

    afterEach(() => {
        globalThis.XMLHttpRequest = original;
        vi.restoreAllMocks();
    });

    it('when XMLHttpRequest does not exist, as in Node', async () => {
        const upload = vi.fn();

        await Delivery.send('/upload', { method: 'POST', body: 'x' }, { onUploadProgress: upload });

        expect(fetch).toHaveBeenCalledTimes(1);
        expect(upload).not.toHaveBeenCalled();
    });
});
