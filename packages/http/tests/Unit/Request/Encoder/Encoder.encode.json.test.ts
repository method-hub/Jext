import { describe, expect, it } from 'vitest';
import Encoder from '@Http/Request/Encoder';

describe('Encoder.encode should send JSON with application/json', () => {
    it.each([
        ['an object', { name: 'Alice', tags: ['a'] }, '{"name":"Alice","tags":["a"]}'],
        ['an array', [1, 2], '[1,2]'],
        ['zero', 0, '0'],
        ['false', false, 'false'],
    ])('when the body is %s', (_name, payload, json) => {
        const value: object | number | boolean = payload;

        const encoded = Encoder.encode(value);

        expect(encoded).toEqual({ body: json, contentType: 'application/json' });
    });
});
