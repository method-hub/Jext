import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Http from '@Http/Http';
import Root from '@Http/Root/Root';
import JsonParser from '@Http/Parsers/JsonParser';

describe('Http.send should decode the error body into error.data', () => {
    beforeEach(() => {
        vi.spyOn(globalThis, 'fetch').mockResolvedValue(
            new Response('{"message":"User not found"}', {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
            })
        );
    });

    afterEach(() => vi.restoreAllMocks());

    it('when the error response has a JSON body', async () => {
        const http = new Http(new Root<{ message: string }>().add(new JsonParser<{ message: string }>()));

        const { error } = await http.send<{ id: number }, { message: string }>('https://api.example.com/users/42');

        expect(error?.data).toEqual({ message: 'User not found' });
    });
});
