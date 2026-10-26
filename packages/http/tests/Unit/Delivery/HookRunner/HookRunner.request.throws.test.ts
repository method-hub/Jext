import { describe, expect, it } from 'vitest';
import HookRunner from '@Http/Delivery/HookRunner';

describe('HookRunner.request should reject with an HttpError', () => {
    it('when a hook throws', async () => {
        const cause = new Error('no token');
        const runner = new HookRunner({
            beforeRequest: [
                () => {
                    throw cause;
                },
            ],
        });

        const result = runner.request({ url: 'https://api.example.com/users', init: {} });

        await expect(result).rejects.toMatchObject({
            name: 'HttpError',
            message: 'A beforeRequest hook failed',
            status: 0,
            response: null,
            cause,
        });
    });
});
