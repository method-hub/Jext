import { describe, expect, it } from 'vitest';
import Encoder from '@Http/Request/Encoder';

describe('Encoder.encode should throw TypeError', () => {
    it('when the object cannot be serialized to JSON', () => {
        const payload: { self?: object } = {};
        payload.self = payload;

        const encode = (): unknown => Encoder.encode(payload);

        expect(encode).toThrow(TypeError);
    });
});
