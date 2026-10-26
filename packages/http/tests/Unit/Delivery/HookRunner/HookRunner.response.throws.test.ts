import { describe, expect, it } from 'vitest';
import HookRunner from '@Http/Delivery/HookRunner';

describe('HookRunner.response should reject with an HttpError that keeps the response', () => {
    it('when a hook throws', async () => {
        const response = new Response('denied', { status: 401 });
        const runner = new HookRunner({
            afterResponse: [
                () => {
                    throw new Error('refresh failed');
                },
            ],
        });

        const result = runner.response(response, { url: 'https://api.example.com/x', init: {} });

        await expect(result).rejects.toMatchObject({
            name: 'HttpError',
            message: 'An afterResponse hook failed',
            status: 401,
            response,
        });
    });
});
