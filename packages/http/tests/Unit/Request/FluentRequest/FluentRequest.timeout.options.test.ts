import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import FluentRequest from '@Http/Request/FluentRequest';
import type { SendOptions } from '@Http/Contract/SendOptions';
import type { Result } from '@Http/Contract/Result';
import type { Sender } from '@Http/Contract/Sender';

describe('FluentRequest should pass the same timeout and retries from options as from chain methods', () => {
    let send: Mock<(...args: [string, RequestInit, SendOptions]) => Promise<Result<unknown>>>;

    beforeEach(() => {
        send = vi
            .fn<(...args: [string, RequestInit, SendOptions]) => Promise<Result<unknown>>>()
            .mockResolvedValue({ data: null, error: null });
    });

    it('when timeout and retry come in the options object', async () => {
        const sender = { send } as unknown as Sender;
        const target = { method: 'GET', url: '/api/report' };

        await new FluentRequest<unknown>(sender, { ...target, options: { timeout: 5000, retry: 2 } });
        await new FluentRequest<unknown>(sender, { ...target, options: {} }).timeout(5000).retry(2);

        const [[, , fromOptions], [, , fromChain]] = send.mock.calls;
        expect(fromOptions).toEqual(expect.objectContaining({ timeout: 5000, retry: 2 }));
        expect(fromChain).toEqual(fromOptions);
    });
});
