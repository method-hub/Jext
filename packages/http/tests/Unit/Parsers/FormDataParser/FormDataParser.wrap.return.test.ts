import { describe, expect, it } from 'vitest';
import FormDataParser from '@Http/Parsers/FormDataParser';

describe('FormDataParser.wrap should return FormData with the fields of the body', () => {
    it('when the body is valid multipart', async () => {
        const form = new FormData();
        form.append('name', 'Alice');
        form.append('age', '30');
        const response = new Response(form);
        const parser = new FormDataParser();

        const data = await parser.wrap(response);

        expect(data.get('name')).toBe('Alice');
        expect(data.get('age')).toBe('30');
    });
});
