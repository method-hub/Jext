import { describe, expect, it } from 'vitest';
import Root from '@Http/Root/Root';
import JsonParser from '@Http/Parsers/JsonParser';

describe('Root.decode should match Content-Type case-insensitively', () => {
    it('when the header is written in mixed case', async () => {
        const root = new Root<{ id: number }>().add(new JsonParser<{ id: number }>());
        const response = new Response('{"id":1}', { headers: { 'Content-Type': 'Application/JSON' } });

        const data = await root.decode(response);

        expect(data).toEqual({ id: 1 });
    });
});
