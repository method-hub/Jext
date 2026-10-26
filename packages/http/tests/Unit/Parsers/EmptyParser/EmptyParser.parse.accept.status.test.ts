import { describe, expect, it } from 'vitest';
import EmptyParser from '@Http/Parsers/EmptyParser';

describe('EmptyParser.parse should accept the response', () => {
    it.each([204, 205, 304])('when the status is %i', (status) => {
        const response = new Response(null, { status, headers: { 'Content-Type': 'application/json' } });
        const parser = new EmptyParser();

        const accepted = parser.parse({ response, contentType: 'application/json', disposition: '' });

        expect(accepted).toBe(true);
    });
});
