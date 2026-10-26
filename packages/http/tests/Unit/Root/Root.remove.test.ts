import { describe, expect, it } from 'vitest';
import Root from '@Http/Root/Root';
import TextParser from '@Http/Parsers/TextParser';

describe('Root.decode should skip a removed parser', () => {
    it('when the parser was added and then removed', async () => {
        const text = new TextParser();
        const root = new Root<string | ArrayBuffer>().add(text).remove(text);
        const response = new Response('hello', { headers: { 'Content-Type': 'text/plain' } });

        const data = await root.decode(response);

        expect(data).toBeInstanceOf(ArrayBuffer);
    });
});
