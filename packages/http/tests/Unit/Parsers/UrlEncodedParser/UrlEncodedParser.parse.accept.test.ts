import { describe, expect, it } from 'vitest';
import UrlEncodedParser from '@Http/Parsers/UrlEncodedParser';

describe('UrlEncodedParser.parse should accept the response', () => {
    it.each(['application/x-www-form-urlencoded', 'application/x-www-form-urlencoded; charset=utf-8'])(
        'when Content-Type is %s',
        (contentType) => {
            const response = new Response('');
            const parser = new UrlEncodedParser();

            const accepted = parser.parse({ response, contentType, disposition: '' });

            expect(accepted).toBe(true);
        }
    );
});
