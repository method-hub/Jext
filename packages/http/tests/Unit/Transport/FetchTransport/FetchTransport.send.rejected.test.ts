import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import FetchTransport from '@Http/Transport/FetchTransport';

describe('FetchTransport.send should reject without reporting progress', () => {
    beforeEach(() => {
        vi.spyOn(globalThis, 'fetch').mockRejectedValue(new TypeError('Failed to fetch'));
    });

    afterEach(() => vi.restoreAllMocks());

    it('when fetch rejects', async () => {
        const listener = vi.fn();

        const sending = new FetchTransport(listener).send('/x', {});

        await expect(sending).rejects.toHaveProperty('name', 'TypeError');
        expect(listener).not.toHaveBeenCalled();
    });
});
