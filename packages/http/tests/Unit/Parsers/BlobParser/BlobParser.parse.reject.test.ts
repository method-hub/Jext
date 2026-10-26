import { describe, expect, it } from 'vitest';
import BlobParser from '@Http/Parsers/BlobParser';

describe('BlobParser.parse should reject the response', () => {
    it.each(['inline', 'inline; filename="document.pdf"', ''])('when Content-Disposition is "%s"', (disposition) => {
        const response = new Response('');
        const parser = new BlobParser();

        const accepted = parser.parse({ response, contentType: 'application/pdf', disposition });

        expect(accepted).toBe(false);
    });
});
