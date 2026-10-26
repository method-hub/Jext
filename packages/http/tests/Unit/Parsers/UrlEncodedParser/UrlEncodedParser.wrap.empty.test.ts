import { describe, expect, it } from 'vitest';
import UrlEncodedParser from '@Http/Parsers/UrlEncodedParser';

describe('UrlEncodedParser.wrap should return empty URLSearchParams', () => {
    it('when the body is empty', async () => {
        const response = new Response('');
        const parser = new UrlEncodedParser();

        const data = await parser.wrap(response);

        expect([...data.keys()]).toEqual([]);
    });
});
