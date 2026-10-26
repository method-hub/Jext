import { describe, expect, it } from 'vitest';
import CsvParser from '@Http/Parsers/CsvParser';

describe('CsvParser.parse should accept the response', () => {
    it.each(['text/csv', 'text/csv; charset=utf-8', 'application/csv', 'text/tab-separated-values'])(
        'when Content-Type is %s',
        (contentType) => {
            const response = new Response('');
            const parser = new CsvParser();

            const accepted = parser.parse({ response, contentType, disposition: '' });

            expect(accepted).toBe(true);
        }
    );
});
