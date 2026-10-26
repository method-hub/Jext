import { describe, expect, it } from 'vitest';
import TextParser from '@Http/Parsers/TextParser';

describe('TextParser.wrap should return the body as a string', () => {
    it('when the body is text', async () => {
        const response = new Response('hello world');
        const parser = new TextParser();

        const data = await parser.wrap(response);

        expect(data).toBe('hello world');
    });
});
