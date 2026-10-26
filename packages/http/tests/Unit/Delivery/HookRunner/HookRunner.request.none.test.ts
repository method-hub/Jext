import { describe, expect, it } from 'vitest';
import HookRunner from '@Http/Delivery/HookRunner';

describe('HookRunner.request should return the same request', () => {
    it('when there are no hooks', async () => {
        const runner = new HookRunner();
        const request = { url: 'https://api.example.com/users', init: {} };

        const result = await runner.request(request);

        expect(result).toBe(request);
    });
});
