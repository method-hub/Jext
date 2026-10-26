import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import FluentRequest from '@Http/Request/FluentRequest';
import type { Decoding } from '@Http/Contract/Decoding';
import type { Result } from '@Http/Contract/Result';
import type { Sender } from '@Http/Contract/Sender';

describe('FluentRequest.as should pass the format to the sender', () => {
    let send: Mock<(...args: [string, RequestInit, Decoding]) => Promise<Result<unknown>>>;
    let request: FluentRequest<{ id: number }>;

    beforeEach(() => {
        send = vi
            .fn<(...args: [string, RequestInit, Decoding]) => Promise<Result<unknown>>>()
            .mockResolvedValue({ data: null, error: null });
        request = new FluentRequest<{ id: number }>({ send } as unknown as Sender, {
            method: 'GET',
            url: 'https://api.example.com/users',
            options: {},
        });
    });

    it('when the request is awaited', async () => {
        await request.as('csv');

        const [[, , decoding]] = send.mock.calls;
        expect(decoding).toEqual(expect.objectContaining({ format: 'csv' }));
    });
});
