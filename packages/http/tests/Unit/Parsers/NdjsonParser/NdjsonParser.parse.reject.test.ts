import { describe, expect, it } from 'vitest';
import NdjsonParser from '@Http/Parsers/NdjsonParser';

describe('NdjsonParser.parse should reject the response', () => {
    it.each(['application/json', 'text/plain'])('when Content-Type is %s', (contentType) => {
        const response = new Response('');
        const parser = new NdjsonParser<unknown>();

        const accepted = parser.parse({ response, contentType, disposition: '' });

        expect(accepted).toBe(false);
    });
});
