import { describe, expect, it } from 'vitest';
import CsvParser from '@Http/Parsers/CsvParser';

describe('CsvParser.wrap should split fields by tabs', () => {
    it('when Content-Type is text/tab-separated-values', async () => {
        const response = new Response('name\tcity\nAlice\tParis, France', {
            headers: { 'Content-Type': 'text/tab-separated-values' },
        });
        const parser = new CsvParser();

        const data = await parser.wrap(response);

        expect(data).toEqual([
            ['name', 'city'],
            ['Alice', 'Paris, France'],
        ]);
    });
});
