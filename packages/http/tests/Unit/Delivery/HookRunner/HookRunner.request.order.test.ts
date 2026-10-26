import { describe, expect, it } from 'vitest';
import HookRunner from '@Http/Delivery/HookRunner';
import type { Outgoing } from '@Http/Contract/Hooks';

describe('HookRunner.request should pass each hook what the one before returned', () => {
    it('when two hooks change the request', async () => {
        const runner = new HookRunner({
            beforeRequest: [
                ({ url, init }: Outgoing) => ({ url: `${url as string}?a=1`, init }),
                ({ url, init }: Outgoing) => ({ url, init: { ...init, headers: { 'X-Url': url as string } } }),
            ],
        });

        const result = await runner.request({ url: 'https://api.example.com/users', init: {} });

        expect(result.url).toBe('https://api.example.com/users?a=1');
        expect(result.init.headers).toEqual({ 'X-Url': 'https://api.example.com/users?a=1' });
    });
});
