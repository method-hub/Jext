import { describe, expect, it } from 'vitest';
import Root from '@Http/Root/Root';
import JsonParser from '@Http/Parsers/JsonParser';

describe('Root.decode should reject', () => {
    it('when the accepting parser cannot decode the body', async () => {
        const root = new Root<{ id: number }>().add(new JsonParser<{ id: number }>());
        const response = new Response('{"id":', { headers: { 'Content-Type': 'application/json' } });

        const data = root.decode(response);

        await expect(data).rejects.toHaveProperty('name', 'SyntaxError');
    });
});
