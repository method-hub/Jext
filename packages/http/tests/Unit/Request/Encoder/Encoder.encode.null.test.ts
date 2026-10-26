import { describe, expect, it } from 'vitest';
import Encoder from '@Http/Request/Encoder';

describe('Encoder.encode should send no body', () => {
    it('when the body is null', () => {
        const payload: null = null;

        const encoded = Encoder.encode(payload);

        expect(encoded).toEqual({ body: null, contentType: null });
    });
});
