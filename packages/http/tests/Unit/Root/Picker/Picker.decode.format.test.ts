import { describe, expect, it } from 'vitest';
import Picker from '@Http/Root/Picker';
import EmptyParser from '@Http/Parsers/EmptyParser';
import JsonParser from '@Http/Parsers/JsonParser';
import TextParser from '@Http/Parsers/TextParser';
import type { Decoder } from '@Http/Contract/Decoder';
import type { Format } from '@Http/Contract/Format';

describe('Picker.decode should decode the body with the decoder of the chosen format', () => {
    it('when Content-Type names another format', async () => {
        const decoders = { json: new JsonParser(), text: new TextParser() } as unknown as Record<
            Format,
            Decoder<unknown>
        >;
        const picker = new Picker(new EmptyParser(), decoders);
        const response = new Response('{"id":1}', { headers: { 'Content-Type': 'text/plain' } });

        const data = await picker.decode(response, 'json');

        expect(data).toEqual({ id: 1 });
    });
});
