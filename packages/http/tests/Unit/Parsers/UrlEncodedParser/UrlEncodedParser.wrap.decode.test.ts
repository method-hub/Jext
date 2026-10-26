import { describe, expect, it } from 'vitest';
import UrlEncodedParser from '@Http/Parsers/UrlEncodedParser';

describe('UrlEncodedParser.wrap should decode values', () => {
    it('when they contain plus signs and percent-encoding', async () => {
        const response = new Response('name=Alice+Smith&city=S%C3%A3o%20Paulo');
        const parser = new UrlEncodedParser();

        const data = await parser.wrap(response);

        expect(data.get('name')).toBe('Alice Smith');
        expect(data.get('city')).toBe('São Paulo');
    });
});
