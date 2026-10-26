import { describe, expect, it } from 'vitest';
import DomParser from '@Http/Parsers/DomParser';

describe('DomParser.parse should reject the response', () => {
    it.each(['text/plain', 'application/xhtml+xml', 'application/json'])('when Content-Type is %s', (contentType) => {
        const response = new Response('');
        const parser = new DomParser();

        const accepted = parser.parse({ response, contentType, disposition: '' });

        expect(accepted).toBe(false);
    });
});
