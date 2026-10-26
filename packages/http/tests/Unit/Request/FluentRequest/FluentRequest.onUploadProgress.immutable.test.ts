import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import FluentRequest from '@Http/Request/FluentRequest';
import type { SendOptions } from '@Http/Contract/SendOptions';
import type { Result } from '@Http/Contract/Result';
import type { Sender } from '@Http/Contract/Sender';

describe('FluentRequest.onUploadProgress should leave the original request without listeners', () => {
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

    it('when the progress methods are called on it', async () => {
        const linked = request.onUploadProgress(vi.fn()).onDownloadProgress(vi.fn());

        await request;

        const [[, , options]] = send.mock.calls;
        expect(linked).not.toBe(request);
        expect(options.onUploadProgress).toBeFalsy();
        expect(options.onDownloadProgress).toBeFalsy();
    });
});
