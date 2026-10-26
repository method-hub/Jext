import { describe, expect, it } from 'vitest';
import CsvParser from '@Http/Parsers/CsvParser';

describe('CsvParser.parse should reject the response', () => {
    it.each(['text/plain', 'application/json'])('when Content-Type is %s', (contentType) => {
        const response = new Response('');
        const parser = new CsvParser();

        const accepted = parser.parse({ response, contentType, disposition: '' });

        expect(accepted).toBe(false);
    });
});
