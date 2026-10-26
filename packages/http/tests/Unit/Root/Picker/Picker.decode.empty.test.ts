import { afterEach, beforeEach, describe, expect, it, vi, type MockInstance } from 'vitest';
import Picker from '@Http/Root/Picker';
import EmptyParser from '@Http/Parsers/EmptyParser';
import JsonParser from '@Http/Parsers/JsonParser';
import type { Decoder } from '@Http/Contract/Decoder';
import type { Format } from '@Http/Contract/Format';

describe('Picker.decode should return null without calling the chosen decoder', () => {
    let json: JsonParser<unknown>;
    let wrap: MockInstance;

    beforeEach(() => {
        json = new JsonParser<unknown>();
        wrap = vi.spyOn(json, 'wrap');
    });

    afterEach(() => vi.restoreAllMocks());

    it('when the response has no body', async () => {
        const picker = new Picker(new EmptyParser(), { json } as unknown as Record<Format, Decoder<unknown>>);
        const response = new Response(null, { status: 204 });

        const data = await picker.decode(response, 'json');

        expect(data).toBeNull();
        expect(wrap).not.toHaveBeenCalled();
    });
});
