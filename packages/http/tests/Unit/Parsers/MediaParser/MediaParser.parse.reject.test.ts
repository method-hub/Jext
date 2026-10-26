import { describe, expect, it } from 'vitest';
import MediaParser from '@Http/Parsers/MediaParser';

describe('MediaParser.parse should reject the response', () => {
    it.each(['application/octet-stream', 'text/plain'])('when Content-Type is %s', (contentType) => {
        const response = new Response('');
        const parser = new MediaParser();

        const accepted = parser.parse({ response, contentType, disposition: '' });

        expect(accepted).toBe(false);
    });
});
