import { describe, expect, it } from 'vitest';
import BlobParser from '@Http/Parsers/BlobParser';

describe('BlobParser.parse should accept the response', () => {
    it.each(['attachment', 'attachment; filename="document.pdf"'])(
        'when Content-Disposition is "%s"',
        (disposition) => {
            const response = new Response('');
            const parser = new BlobParser();

            const accepted = parser.parse({ response, contentType: 'application/pdf', disposition });

            expect(accepted).toBe(true);
        }
    );
});
