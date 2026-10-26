import { describe, expect, it } from 'vitest';
import BlobParser from '@Http/Parsers/BlobParser';

describe('BlobParser.wrap should return the body as a Blob with its type', () => {
    it('when the response is a file', async () => {
        const response = new Response('%PDF-1.4', { headers: { 'Content-Type': 'application/pdf' } });
        const parser = new BlobParser();

        const data = await parser.wrap(response);

        expect(data.type).toBe('application/pdf');
        await expect(data.text()).resolves.toBe('%PDF-1.4');
    });
});
