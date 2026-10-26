import { describe, expect, it, vi } from 'vitest';
import HookRunner from '@Http/Delivery/HookRunner';

describe('HookRunner.request should not call the next hooks', () => {
    it('when a hook rejects', async () => {
        const next = vi.fn();
        const runner = new HookRunner({
            beforeRequest: [() => Promise.reject(new Error('offline')), next],
        });

        const result = runner.request({ url: 'https://api.example.com/users', init: {} });

        await expect(result).rejects.toHaveProperty('message', 'A beforeRequest hook failed');
        expect(next).not.toHaveBeenCalled();
    });
});
