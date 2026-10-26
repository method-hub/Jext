import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Http from '@Http/Http';
import Root from '@Http/Root/Root';
import Picker from '@Http/Root/Picker';
import EmptyParser from '@Http/Parsers/EmptyParser';
import JsonParser from '@Http/Parsers/JsonParser';
import TextParser from '@Http/Parsers/TextParser';
import type { Decoder } from '@Http/Contract/Decoder';
import type { Format } from '@Http/Contract/Format';

describe('Http.send should still detect the error body by Content-Type', () => {
    beforeEach(() => {
        vi.spyOn(globalThis, 'fetch').mockResolvedValue(
            new Response('{"message":"Not found"}', { status: 404, headers: { 'Content-Type': 'application/json' } })
        );
    });

    afterEach(() => vi.restoreAllMocks());

    it('when the server answers an error status and text is chosen', async () => {
        const decoders = { json: new JsonParser(), text: new TextParser() } as unknown as Record<
            Format,
            Decoder<unknown>
        >;
        const http = new Http(
            new Root<unknown>().add(new JsonParser()).add(new TextParser()),
            new Picker(new EmptyParser(), decoders)
        );

        const { error } = await http.send<string, { message: string }>(
            'https://api.example.com/x',
            {},
            { format: 'text' }
        );

        expect(error?.status).toBe(404);
        expect(error?.data).toEqual({ message: 'Not found' });
    });
});
