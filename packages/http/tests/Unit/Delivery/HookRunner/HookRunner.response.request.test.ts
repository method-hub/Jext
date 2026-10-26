import { describe, expect, it, vi } from 'vitest';
import HookRunner from '@Http/Delivery/HookRunner';
import type { AfterResponse } from '@Http/Contract/Hooks';

describe('HookRunner.response should give the hook the response and the request', () => {
    it('when the hook only reads them', async () => {
        const hook = vi.fn<(...args: Parameters<AfterResponse>) => ReturnType<AfterResponse>>();
        const runner = new HookRunner({ afterResponse: [hook] });
        const response = new Response('ok');
        const request = { url: 'https://api.example.com/x', init: { method: 'GET' } };

        const result = await runner.response(response, request);

        expect(result).toBe(response);
        expect(hook).toHaveBeenCalledWith(response, request);
    });
});
