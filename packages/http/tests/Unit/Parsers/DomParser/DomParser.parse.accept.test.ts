import { describe, expect, it } from 'vitest';
import DomParser from '@Http/Parsers/DomParser';

describe('DomParser.parse should accept the response', () => {
    it.each(['text/html', 'text/html; charset=utf-8'])('when Content-Type is %s', (contentType) => {
        const response = new Response('');
        const parser = new DomParser();

        const accepted = parser.parse({ response, contentType, disposition: '' });

        expect(accepted).toBe(true);
    });
});
