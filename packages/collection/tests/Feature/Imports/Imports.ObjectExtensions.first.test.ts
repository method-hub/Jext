import { describe, expect, it, vi } from 'vitest';

describe('Imports should load every wrapper', () => {
    it('when ObjectExtensions is the first module imported', async () => {
        vi.resetModules();

        const loaded: unknown = (await import('@Collection/Object/ObjectExtensions')).default;

        expect(typeof loaded).toEqual('function');
    });
});
