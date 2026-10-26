import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Http from '@Http/Http';
import Root from '@Http/Root/Root';
import Picker from '@Http/Root/Picker';
import EmptyParser from '@Http/Parsers/EmptyParser';
import JsonParser from '@Http/Parsers/JsonParser';
import TextParser from '@Http/Parsers/TextParser';
import type { Decoder } from '@Http/Contract/Decoder';
import type { Format } from '@Http/Contract/Format';

describe('Http.send should decode the body with the chosen format', () => {
    beforeEach(() => {
        vi.spyOn(globalThis, 'fetch').mockResolvedValue(
            new Response('{"id":1}', { headers: { 'Content-Type': 'text/plain' } })
        );
    });

    afterEach(() => vi.restoreAllMocks());

    it('when a format is given and Content-Type names another one', async () => {
        const decoders = { json: new JsonParser(), text: new TextParser() } as unknown as Record<
            Format,
            Decoder<unknown>
        >;
        const http = new Http(
            new Root<unknown>().add(new JsonParser()).add(new TextParser()),
            new Picker(new EmptyParser(), decoders)
        );

        const result = await http.send<{ id: number }>('https://api.example.com/users/1', {}, { format: 'json' });

        expect(result).toEqual({ data: { id: 1 }, error: null });
    });
});
