import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Http from '@Http/Http';
import Root from '@Http/Root/Root';
import TextParser from '@Http/Parsers/TextParser';

describe('Http.send should return an error that explains the missing decoders', () => {
    beforeEach(() => {
        vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('{"id":1}'));
    });

    afterEach(() => vi.restoreAllMocks());

    it('when a format is given to an Http built without a Picker', async () => {
        const http = new Http(new Root<string>().add(new TextParser()));

        const { data, error } = await http.send<unknown>('https://api.example.com/users/1', {}, { format: 'json' });

        expect(data).toBeNull();
        expect(error?.cause).toHaveProperty('name', 'TypeError');
        expect(error?.cause).toHaveProperty('message', expect.stringContaining(".as('json')"));
    });
});
