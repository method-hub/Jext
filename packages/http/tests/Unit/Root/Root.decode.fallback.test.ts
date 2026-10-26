import { describe, expect, it } from 'vitest';
import Root from '@Http/Root/Root';
import TextParser from '@Http/Parsers/TextParser';

describe('Root.decode should return an ArrayBuffer', () => {
    it('when no parser accepts the response', async () => {
        const root = new Root<string | ArrayBuffer>().add(new TextParser());
        const response = new Response(new Uint8Array([1, 2]), { headers: { 'Content-Type': 'application/x-unknown' } });

        const data = await root.decode(response);

        expect(data).toBeInstanceOf(ArrayBuffer);
    });
});
