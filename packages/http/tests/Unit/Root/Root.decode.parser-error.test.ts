import { describe, expect, it } from 'vitest';
import Root from '@Http/Root/Root';
import type { Decoder } from '@Http/Contract/Decoder';

class BrokenParser implements Decoder<never> {
    public parse(): boolean {
        throw new Error('cannot decide');
    }

    public wrap(): Promise<never> {
        return Promise.reject(new Error('unreachable'));
    }
}

describe('Root.decode should reject', () => {
    it('when a parser throws while deciding', async () => {
        const root = new Root<never>().add(new BrokenParser());
        const response = new Response('');

        const data = root.decode(response);

        await expect(data).rejects.toThrow('cannot decide');
    });
});
