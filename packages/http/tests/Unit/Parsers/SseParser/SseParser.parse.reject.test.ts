import { describe, expect, it } from 'vitest';
import SseParser from '@Http/Parsers/SseParser';

describe('SseParser.parse should reject the response', () => {
    it.each(['text/plain', 'application/json'])('when Content-Type is %s', (contentType) => {
        const response = new Response('');
        const parser = new SseParser();

        const accepted = parser.parse({ response, contentType, disposition: '' });

        expect(accepted).toBe(false);
    });
});
