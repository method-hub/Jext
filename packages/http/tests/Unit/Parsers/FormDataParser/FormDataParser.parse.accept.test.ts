import { describe, expect, it } from 'vitest';
import FormDataParser from '@Http/Parsers/FormDataParser';

describe('FormDataParser.parse should accept the response', () => {
    it.each(['multipart/form-data; boundary=x'])('when Content-Type is %s', (contentType) => {
        const response = new Response('');
        const parser = new FormDataParser();

        const accepted = parser.parse({ response, contentType, disposition: '' });

        expect(accepted).toBe(true);
    });
});
