import { describe, expect, it } from 'vitest';
import CsvParser from '@Http/Parsers/CsvParser';

describe('CsvParser.wrap should split the body into rows and fields', () => {
    it('when lines end with LF, CRLF and a trailing line break', async () => {
        const response = new Response('name,age\nAlice,30\r\nBob,25\n', { headers: { 'Content-Type': 'text/csv' } });
        const parser = new CsvParser();

        const data = await parser.wrap(response);

        expect(data).toEqual([
            ['name', 'age'],
            ['Alice', '30'],
            ['Bob', '25'],
        ]);
    });
});
