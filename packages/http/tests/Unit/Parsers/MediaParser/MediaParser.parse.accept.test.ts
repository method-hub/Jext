import { describe, expect, it } from 'vitest';
import MediaParser from '@Http/Parsers/MediaParser';

describe('MediaParser.parse should accept the response', () => {
    it.each(['image/png', 'image/jpeg', 'audio/mpeg', 'video/mp4', 'font/woff2', 'application/pdf'])(
        'when Content-Type is %s',
        (contentType) => {
            const response = new Response('');
            const parser = new MediaParser();

            const accepted = parser.parse({ response, contentType, disposition: '' });

            expect(accepted).toBe(true);
        }
    );
});
