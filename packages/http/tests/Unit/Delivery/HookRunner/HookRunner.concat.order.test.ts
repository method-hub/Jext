import { describe, expect, it, vi } from 'vitest';
import HookRunner from '@Http/Delivery/HookRunner';

describe('HookRunner.concat should put the hooks of the runner first', () => {
    it('when hooks are added', () => {
        const parent = vi.fn();
        const child = vi.fn();
        const after = vi.fn();
        const runner = new HookRunner({ beforeRequest: [parent] });

        const hooks = runner.concat({ beforeRequest: [child], afterResponse: [after] });

        expect(hooks).toEqual({ beforeRequest: [parent, child], afterResponse: [after] });
    });
});
