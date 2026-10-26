import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import FluentRequest from '@Http/Request/FluentRequest';
import type { Result } from '@Http/Contract/Result';
import type { Sender } from '@Http/Contract/Sender';

describe('FluentRequest.then should send the request only once', () => {
    let send: Mock<(...args: [string, RequestInit]) => Promise<Result<string>>>;
    let request: FluentRequest<string>;

    beforeEach(() => {
        send = vi
            .fn<(...args: [string, RequestInit]) => Promise<Result<string>>>()
            .mockResolvedValue({ data: 'ok', error: null });
        request = new FluentRequest<string>({ send } as unknown as Sender, {
            method: 'GET',
            url: 'https://api.example.com/users',
            options: {},
        });
    });

    it('when the same request is awaited twice', async () => {
        const first = await request;
        const second = await request;

        expect(send).toHaveBeenCalledTimes(1);
        expect(second).toBe(first);
    });
});
