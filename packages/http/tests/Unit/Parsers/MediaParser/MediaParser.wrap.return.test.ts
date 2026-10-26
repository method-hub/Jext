import { describe, expect, it } from 'vitest';
import MediaParser from '@Http/Parsers/MediaParser';

describe('MediaParser.wrap should return the body as a Blob with the media type', () => {
    it('when the response is an image', async () => {
        const response = new Response(new Uint8Array([137, 80, 78, 71]), { headers: { 'Content-Type': 'image/png' } });
        const parser = new MediaParser();

        const data = await parser.wrap(response);

        expect(data.type).toBe('image/png');
        expect(data.size).toBe(4);
    });
});
