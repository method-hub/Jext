import { describe, expect, it, vi } from 'vitest';

describe('Imports should load every wrapper', () => {
    it('when StringExtensions is the first module imported', async () => {
        vi.resetModules();

        const loaded: unknown = (await import('@Collection/String/StringExtensions')).default;

        expect(typeof loaded).toEqual('function');
    });
});
