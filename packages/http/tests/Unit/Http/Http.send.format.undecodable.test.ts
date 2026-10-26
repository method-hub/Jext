import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Http from '@Http/Http';
import Root from '@Http/Root/Root';
import Picker from '@Http/Root/Picker';
import EmptyParser from '@Http/Parsers/EmptyParser';
import JsonParser from '@Http/Parsers/JsonParser';
import TextParser from '@Http/Parsers/TextParser';
import type { Decoder } from '@Http/Contract/Decoder';
import type { Format } from '@Http/Contract/Format';

describe('Http.send should return an error instead of the data', () => {
    beforeEach(() => {
        vi.spyOn(globalThis, 'fetch').mockResolvedValue(
            new Response('<html></html>', { headers: { 'Content-Type': 'text/html' } })
        );
    });

    afterEach(() => vi.restoreAllMocks());

    it('when the body cannot be decoded in the chosen format', async () => {
        const decoders = { json: new JsonParser(), text: new TextParser() } as unknown as Record<
            Format,
            Decoder<unknown>
        >;
        const http = new Http(
            new Root<unknown>().add(new JsonParser()).add(new TextParser()),
            new Picker(new EmptyParser(), decoders)
        );

        const { data, error } = await http.send<unknown>('https://api.example.com/page', {}, { format: 'json' });

        expect(data).toBeNull();
        expect(error?.message).toBe('The response body could not be decoded');
        expect(error?.status).toBe(200);
        expect(error?.cause).toHaveProperty('name', 'SyntaxError');
    });
});
