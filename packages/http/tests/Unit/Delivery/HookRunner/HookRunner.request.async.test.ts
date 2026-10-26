import { describe, expect, it } from 'vitest';
import HookRunner from '@Http/Delivery/HookRunner';

describe('HookRunner.request should wait for an async hook', () => {
    it('when the hook resolves with a new request', async () => {
        const token = (): Promise<string> => Promise.resolve('Bearer fresh');
        const runner = new HookRunner({
            beforeRequest: [
                async ({ url, init }) => ({ url, init: { ...init, headers: { Authorization: await token() } } }),
            ],
        });

        const result = await runner.request({ url: 'https://api.example.com/users', init: {} });

        expect(result.init.headers).toEqual({ Authorization: 'Bearer fresh' });
    });
});
