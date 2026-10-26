import { afterEach, beforeEach, describe, expect, it, vi, type MockInstance } from 'vitest';
import FetchTransport from '@Http/Transport/FetchTransport';

describe('FetchTransport.send should return the response of fetch as it is', () => {
    let response: Response;
    let fetch: MockInstance;

    beforeEach(() => {
        response = new Response('ok');
        fetch = vi.spyOn(globalThis, 'fetch').mockResolvedValue(response);
    });

    afterEach(() => vi.restoreAllMocks());

    it('when no download listener is given', async () => {
        const init = { method: 'GET' };

        const received = await new FetchTransport().send('https://api.example.com/x', init);

        expect(received).toBe(response);
        expect(fetch).toHaveBeenCalledWith('https://api.example.com/x', init);
    });
});
