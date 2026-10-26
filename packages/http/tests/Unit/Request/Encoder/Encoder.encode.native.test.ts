import { describe, expect, it } from 'vitest';
import Encoder from '@Http/Request/Encoder';

describe('Encoder.encode should pass the body through and leave Content-Type to fetch', () => {
    it.each([
        ['a string', 'plain text'],
        ['FormData', new FormData()],
        ['URLSearchParams', new URLSearchParams('a=1')],
        ['a Blob', new Blob(['x'], { type: 'image/png' })],
        ['an ArrayBuffer', new ArrayBuffer(4)],
        ['a typed array', new Uint8Array([1, 2])],
        ['a ReadableStream', new ReadableStream()],
    ])('when the body is %s', (_name, payload) => {
        const value: BodyInit = payload;

        const encoded = Encoder.encode(value);

        expect(encoded.body).toBe(value);
        expect(encoded.contentType).toBeNull();
    });
});
