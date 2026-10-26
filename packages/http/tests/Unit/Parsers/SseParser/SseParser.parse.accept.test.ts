import { describe, expect, it } from 'vitest';
import SseParser from '@Http/Parsers/SseParser';

describe('SseParser.parse should accept the response', () => {
    it.each(['text/event-stream', 'text/event-stream; charset=utf-8'])('when Content-Type is %s', (contentType) => {
        const response = new Response('');
        const parser = new SseParser();

        const accepted = parser.parse({ response, contentType, disposition: '' });

        expect(accepted).toBe(true);
    });
});
