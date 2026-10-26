import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import FluentRequest from '@Http/Request/FluentRequest';
import type { Result } from '@Http/Contract/Result';
import type { Sender } from '@Http/Contract/Sender';

describe('FluentRequest should send the same request from options as from chain methods', () => {
    let send: Mock<(...args: [string, RequestInit]) => Promise<Result<string>>>;

    beforeEach(() => {
        send = vi
            .fn<(...args: [string, RequestInit]) => Promise<Result<string>>>()
            .mockResolvedValue({ data: 'ok', error: null });
    });

    it('when query, headers, body and keepalive come in the options object', async () => {
        const sender = { send } as unknown as Sender;
        const target = { method: 'POST', url: '/api/users' };
        const options = { query: { a: 1 }, headers: { 'X-A': '1' }, body: { name: 'Alice' }, keepalive: true };

        await new FluentRequest<string>(sender, { ...target, options });
        await new FluentRequest<string>(sender, { ...target, options: {} })
            .query({ a: 1 })
            .headers({ 'X-A': '1' })
            .body({ name: 'Alice' })
            .keepalive();

        const [[fromOptions, optionsInit], [fromChain, chainInit]] = send.mock.calls;
        expect(fromOptions).toBe(fromChain);
        expect({ ...optionsInit, headers: [...new Headers(optionsInit.headers)] }).toEqual({
            ...chainInit,
            headers: [...new Headers(chainInit.headers)],
        });
    });
});
