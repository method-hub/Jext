import { describe, expect, it } from 'vitest';
import EmptyParser from '@Http/Parsers/EmptyParser';

describe('EmptyParser.parse should accept the response', () => {
    it('when the body is null, as after a HEAD request', () => {
        const response = new Response(null, { status: 200 });
        const parser = new EmptyParser();

        const accepted = parser.parse({ response, contentType: '', disposition: '' });

        expect(accepted).toBe(true);
    });
});
