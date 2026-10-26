import { describe, expect, it } from 'vitest';
import Root from '@Http/Root/Root';
import TextParser from '@Http/Parsers/TextParser';
import CsvParser from '@Http/Parsers/CsvParser';

describe('Root.decode should hand the response to the first parser that accepts it', () => {
    it('when two parsers accept the same Content-Type', async () => {
        const root = new Root<string | string[][]>().add(new TextParser()).add(new CsvParser());
        const response = new Response('a,b', { headers: { 'Content-Type': 'text/csv' } });

        const data = await root.decode(response);

        expect(data).toBe('a,b');
    });
});
