import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import FluentRequest from '@Http/Request/FluentRequest';
import type { SendOptions } from '@Http/Contract/SendOptions';
import type { Result } from '@Http/Contract/Result';
import type { Sender } from '@Http/Contract/Sender';

describe('FluentRequest.onDownloadProgress should pass the listener to the sender', () => {
    let send: Mock<(...args: [string, RequestInit, SendOptions]) => Promise<Result<unknown>>>;
    let request: FluentRequest<string>;

    beforeEach(() => {
        send = vi
            .fn<(...args: [string, RequestInit, SendOptions]) => Promise<Result<unknown>>>()
            .mockResolvedValue({ data: null, error: null });
        request = new FluentRequest<string>({ send } as unknown as Sender, {
            method: 'POST',
            url: 'https://api.example.com/files',
            options: {},
        });
    });

    it('when the request is awaited', async () => {
        const listener = vi.fn();

        await request.onDownloadProgress(listener);

        const [[, , options]] = send.mock.calls;
        expect(options.onDownloadProgress).toBe(listener);
    });
});
