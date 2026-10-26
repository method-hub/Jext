import { describe, expect, it } from 'vitest';
import CsvParser from '@Http/Parsers/CsvParser';

describe('CsvParser.wrap should return no rows', () => {
    it('when the body is empty', async () => {
        const response = new Response('', { headers: { 'Content-Type': 'text/csv' } });
        const parser = new CsvParser();

        const data = await parser.wrap(response);

        expect(data).toEqual([]);
    });
});
