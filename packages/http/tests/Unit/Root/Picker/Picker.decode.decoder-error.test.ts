import { describe, expect, it } from 'vitest';
import Picker from '@Http/Root/Picker';
import EmptyParser from '@Http/Parsers/EmptyParser';
import JsonParser from '@Http/Parsers/JsonParser';
import type { Decoder } from '@Http/Contract/Decoder';
import type { Format } from '@Http/Contract/Format';

describe('Picker.decode should reject with the error of the chosen decoder', () => {
    it('when the body is not valid in the chosen format', async () => {
        const decoders = { json: new JsonParser() } as unknown as Record<Format, Decoder<unknown>>;
        const picker = new Picker(new EmptyParser(), decoders);
        const response = new Response('<html></html>', { headers: { 'Content-Type': 'text/html' } });

        const decoding = picker.decode(response, 'json');

        await expect(decoding).rejects.toHaveProperty('name', 'SyntaxError');
    });
});
