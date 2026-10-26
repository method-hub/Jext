import { describe, expect, it } from 'vitest';
import BinaryParser from '@Http/Parsers/BinaryParser';

describe('BinaryParser.parse should accept the response', () => {
    it.each(['application/octet-stream', 'application/binary'])('when Content-Type is %s', (contentType) => {
        const response = new Response('');
        const parser = new BinaryParser();

        const accepted = parser.parse({ response, contentType, disposition: '' });

        expect(accepted).toBe(true);
    });
});
