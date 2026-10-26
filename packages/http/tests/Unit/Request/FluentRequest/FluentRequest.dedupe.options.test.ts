import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import FluentRequest from '@Http/Request/FluentRequest';
import type { SendOptions } from '@Http/Contract/SendOptions';
import type { Result } from '@Http/Contract/Result';
import type { Sender } from '@Http/Contract/Sender';

describe('FluentRequest.dedupe should give the same options as the dedupe option', () => {
    let send: Mock<(...args: [string, RequestInit, SendOptions]) => Promise<Result<unknown>>>;

    beforeEach(() => {
        send = vi
            .fn<(...args: [string, RequestInit, SendOptions]) => Promise<Result<unknown>>>()
            .mockResolvedValue({ data: null, error: null });
    });

    it('when one request uses the chain and the other the options object', async () => {
        const target = { method: 'GET', url: 'https://api.example.com/users' };
        const sender = { send } as unknown as Sender;

        await new FluentRequest<string>(sender, { ...target, options: {} }).dedupe();
        await new FluentRequest<string>(sender, { ...target, options: { dedupe: true } });

        const [[, , fromChain], [, , fromOptions]] = send.mock.calls;
        expect(fromOptions).toEqual(fromChain);
    });
});
