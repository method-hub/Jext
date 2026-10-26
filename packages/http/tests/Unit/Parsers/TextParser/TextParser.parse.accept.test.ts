import { describe, expect, it } from 'vitest';
import TextParser from '@Http/Parsers/TextParser';

describe('TextParser.parse should accept the response', () => {
    it.each(['text/plain', 'text/markdown', 'application/javascript', 'application/sql'])(
        'when Content-Type is %s',
        (contentType) => {
            const response = new Response('');
            const parser = new TextParser();

            const accepted = parser.parse({ response, contentType, disposition: '' });

            expect(accepted).toBe(true);
        }
    );
});
