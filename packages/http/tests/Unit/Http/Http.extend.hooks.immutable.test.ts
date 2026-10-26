import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Http from '@Http/Http';
import Root from '@Http/Root/Root';
import TextParser from '@Http/Parsers/TextParser';

describe('Http.extend should leave the hooks of the parent client as they were', () => {
    beforeEach(() => {
        vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('ok'));
    });

    afterEach(() => vi.restoreAllMocks());

    it('when a child client adds a hook', async () => {
        const child = vi.fn();
        const parent = new Http(new Root<string>().add(new TextParser()));
        parent.extend({ hooks: { beforeRequest: [child] } });

        await parent.get<string>('https://api.example.com/users');

        expect(child).not.toHaveBeenCalled();
    });
});
