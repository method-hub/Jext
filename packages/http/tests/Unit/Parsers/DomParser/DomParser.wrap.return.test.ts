// @vitest-environment jsdom-with-fetch

import { describe, expect, it } from 'vitest';
import DomParser from '@Http/Parsers/DomParser';

describe('DomParser.wrap should return a Document built from the body', () => {
    it('when the body is HTML', async () => {
        const response = new Response('<html lang="en"><body><p>Hello</p></body></html>');
        const parser = new DomParser();

        const data = await parser.wrap(response);

        expect(data.nodeName).toBe('#document');
        expect(data.querySelector('p')?.textContent).toBe('Hello');
    });
});
