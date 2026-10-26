import { describe, expect, it } from 'vitest';
import FormDataParser from '@Http/Parsers/FormDataParser';

describe('FormDataParser.wrap should reject', () => {
    it('when the boundary in Content-Type does not match the body', async () => {
        const response = new Response('--other\r\nContent-Disposition: form-data; name="a"\r\n\r\n1\r\n--other--\r\n', {
            headers: { 'Content-Type': 'multipart/form-data; boundary=expected' },
        });
        const parser = new FormDataParser();

        const data = parser.wrap(response);

        await expect(data).rejects.toHaveProperty('name', 'TypeError');
    });
});
