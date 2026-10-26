import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Http from '@Http/Http';
import Root from '@Http/Root/Root';
import TextParser from '@Http/Parsers/TextParser';

describe('Http.extend should run the hooks of the parent client first', () => {
    beforeEach(() => {
        vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('ok'));
    });

    afterEach(() => vi.restoreAllMocks());

    it('when both clients have a beforeRequest hook', async () => {
        const calls: string[] = [];
        const api = new Http(new Root<string>().add(new TextParser()))
            .extend({ hooks: { beforeRequest: [() => void calls.push('parent')] } })
            .extend({ hooks: { beforeRequest: [() => void calls.push('child')] } });

        await api.get<string>('https://api.example.com/users');

        expect(calls).toEqual(['parent', 'child']);
    });
});
