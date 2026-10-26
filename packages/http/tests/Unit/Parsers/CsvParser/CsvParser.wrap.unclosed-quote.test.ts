import { describe, expect, it } from 'vitest';
import CsvParser from '@Http/Parsers/CsvParser';

describe('CsvParser.wrap should keep the rest of the body as one field', () => {
    it('when a quote is never closed', async () => {
        const response = new Response('a,"b\nc', { headers: { 'Content-Type': 'text/csv' } });
        const parser = new CsvParser();

        const data = await parser.wrap(response);

        expect(data).toEqual([['a', 'b\nc']]);
    });
});
