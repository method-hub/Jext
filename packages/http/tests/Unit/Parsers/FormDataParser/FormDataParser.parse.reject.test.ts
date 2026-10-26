import { describe, expect, it } from 'vitest';
import FormDataParser from '@Http/Parsers/FormDataParser';

describe('FormDataParser.parse should reject the response', () => {
    it.each(['application/x-www-form-urlencoded', 'application/json'])('when Content-Type is %s', (contentType) => {
        const response = new Response('');
        const parser = new FormDataParser();

        const accepted = parser.parse({ response, contentType, disposition: '' });

        expect(accepted).toBe(false);
    });
});
