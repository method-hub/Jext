import { describe, expect, it } from 'vitest';
import EmptyParser from '@Http/Parsers/EmptyParser';

describe('EmptyParser.parse should reject the response', () => {
    it('when the status is 200 and there is a body', () => {
        const response = new Response('{}', { headers: { 'Content-Type': 'application/json' } });
        const parser = new EmptyParser();

        const accepted = parser.parse({ response, contentType: 'application/json', disposition: '' });

        expect(accepted).toBe(false);
    });

    it('when Content-Length is not 0', () => {
        const response = new Response('{}', { headers: { 'Content-Length': '2' } });
        const parser = new EmptyParser();

        const accepted = parser.parse({ response, contentType: 'application/json', disposition: '' });

        expect(accepted).toBe(false);
    });
});
