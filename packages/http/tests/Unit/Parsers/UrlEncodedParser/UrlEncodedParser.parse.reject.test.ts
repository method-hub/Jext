import { describe, expect, it } from 'vitest';
import UrlEncodedParser from '@Http/Parsers/UrlEncodedParser';

describe('UrlEncodedParser.parse should reject the response', () => {
    it.each(['multipart/form-data; boundary=x', 'application/json'])('when Content-Type is %s', (contentType) => {
        const response = new Response('');
        const parser = new UrlEncodedParser();

        const accepted = parser.parse({ response, contentType, disposition: '' });

        expect(accepted).toBe(false);
    });
});
