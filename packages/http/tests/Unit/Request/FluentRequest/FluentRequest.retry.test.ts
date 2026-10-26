import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import FluentRequest from '@Http/Request/FluentRequest';
import type { SendOptions } from '@Http/Contract/SendOptions';
import type { Result } from '@Http/Contract/Result';
import type { Sender } from '@Http/Contract/Sender';

describe('FluentRequest.retry should pass the retries to the sender', () => {
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

    it.each([2, { limit: 3, statuses: [503], delay: 100 }])('when retry(%p) is called', async (retry) => {
        await request.retry(retry);

        const [[, , options]] = send.mock.calls;
        expect(options.retry).toEqual(retry);
    });
});
