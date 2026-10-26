import { describe, expect, it, vi } from 'vitest';
import HookRunner from '@Http/Delivery/HookRunner';

describe('HookRunner.request should keep the request', () => {
    it('when a hook returns nothing', async () => {
        const seen = vi.fn();
        const runner = new HookRunner({
            beforeRequest: [
                (request) => {
                    seen(request.url);
                    // eslint-disable-next-line no-undefined -- a hook that returns nothing is what is tested
                    return undefined;
                },
            ],
        });
        const request = { url: 'https://api.example.com/users', init: {} };

        const result = await runner.request(request);

        expect(result).toBe(request);
        expect(seen).toHaveBeenCalledWith('https://api.example.com/users');
    });
});
