import { describe, expect, it } from 'vitest';
import EmptyParser from '@Http/Parsers/EmptyParser';

describe('EmptyParser.parse should accept the response', () => {
    it('when Content-Length is 0', () => {
        const response = new Response('', { headers: { 'Content-Length': '0' } });
        const parser = new EmptyParser();

        const accepted = parser.parse({ response, contentType: 'application/json', disposition: '' });

        expect(accepted).toBe(true);
    });
});
