import { describe, expect, it } from 'vitest';
import BinaryParser from '@Http/Parsers/BinaryParser';

describe('BinaryParser.wrap should return the bytes of the body as an ArrayBuffer', () => {
    it('when the body is binary', async () => {
        const response = new Response(new Uint8Array([0, 1, 2, 255]));
        const parser = new BinaryParser();

        const data = await parser.wrap(response);

        expect([...new Uint8Array(data)]).toEqual([0, 1, 2, 255]);
    });
});
