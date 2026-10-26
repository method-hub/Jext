import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import FetchTransport from '@Http/Transport/FetchTransport';
import type { Progress } from '@Http/Contract/Progress';

describe('FetchTransport.send should report only the loaded bytes', () => {
    beforeEach(() => {
        vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('hello'));
    });

    afterEach(() => vi.restoreAllMocks());

    it('when the response has no Content-Length', async () => {
        const reports: Progress[] = [];

        const response = await new FetchTransport((progress) => reports.push(progress)).send('/x', {});
        await response.text();

        expect(reports).toEqual([{ loaded: 5 }]);
    });
});
