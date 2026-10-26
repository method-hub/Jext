import { describe, expect, it } from 'vitest';
import HookRunner from '@Http/Delivery/HookRunner';

describe('HookRunner.response should return the response of the last hook', () => {
    it('when a hook returns another response', async () => {
        const replacement = new Response('second');
        const runner = new HookRunner({ afterResponse: [() => replacement] });

        const result = await runner.response(new Response('first'), { url: 'https://api.example.com/x', init: {} });

        expect(result).toBe(replacement);
    });
});
