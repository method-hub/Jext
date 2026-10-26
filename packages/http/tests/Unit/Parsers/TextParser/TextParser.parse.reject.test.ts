import { describe, expect, it } from 'vitest';
import TextParser from '@Http/Parsers/TextParser';

describe('TextParser.parse should reject the response', () => {
    it.each(['application/json', 'image/png'])('when Content-Type is %s', (contentType) => {
        const response = new Response('');
        const parser = new TextParser();

        const accepted = parser.parse({ response, contentType, disposition: '' });

        expect(accepted).toBe(false);
    });
});
