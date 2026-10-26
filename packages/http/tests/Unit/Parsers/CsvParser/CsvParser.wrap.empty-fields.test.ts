import { describe, expect, it } from 'vitest';
import CsvParser from '@Http/Parsers/CsvParser';

describe('CsvParser.wrap should keep empty fields', () => {
    it('when delimiters follow each other', async () => {
        const response = new Response('a,,c\n,,', { headers: { 'Content-Type': 'text/csv' } });
        const parser = new CsvParser();

        const data = await parser.wrap(response);

        expect(data).toEqual([
            ['a', '', 'c'],
            ['', '', ''],
        ]);
    });
});
