import { describe, expect, it } from 'vitest';
import UrlEncodedParser from '@Http/Parsers/UrlEncodedParser';

describe('UrlEncodedParser.wrap should keep every value of a repeated key', () => {
    it('when a key appears several times', async () => {
        const response = new Response('tag=a&tag=b');
        const parser = new UrlEncodedParser();

        const data = await parser.wrap(response);

        expect(data.getAll('tag')).toEqual(['a', 'b']);
    });
});
