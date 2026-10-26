import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import FluentRequest from '@Http/Request/FluentRequest';
import type { SendOptions } from '@Http/Contract/SendOptions';
import type { Result } from '@Http/Contract/Result';
import type { Sender } from '@Http/Contract/Sender';

describe('FluentRequest.dedupe should leave the original request without dedupe', () => {
    let send: Mock<(...args: [string, RequestInit, SendOptions]) => Promise<Result<unknown>>>;
    let request: FluentRequest<string>;

    beforeEach(() => {
        send = vi
            .fn<(...args: [string, RequestInit, SendOptions]) => Promise<Result<unknown>>>()
            .mockResolvedValue({ data: null, error: null });
        request = new FluentRequest<string>({ send } as unknown as Sender, {
            method: 'GET',
            url: 'https://api.example.com/users',
            options: {},
        });
    });

    it('when dedupe is called on it', async () => {
        const linked = request.dedupe();

        await request;

        const [[, , options]] = send.mock.calls;
        expect(linked).not.toBe(request);
        expect(options.dedupe).toBeUndefined();
    });
});
