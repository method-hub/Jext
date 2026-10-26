import { describe, expect, it } from 'vitest';
import CsvParser from '@Http/Parsers/CsvParser';

describe('CsvParser.wrap should keep the content of quoted fields', () => {
    it('when they contain the delimiter, line breaks and doubled quotes', async () => {
        const response = new Response('"Smith, John","line 1\nline 2","say ""hi"""', {
            headers: { 'Content-Type': 'text/csv' },
        });
        const parser = new CsvParser();

        const data = await parser.wrap(response);

        expect(data).toEqual([['Smith, John', 'line 1\nline 2', 'say "hi"']]);
    });
});
