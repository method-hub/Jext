import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import FluentRequest from '@Http/Request/FluentRequest';
import type { SendOptions } from '@Http/Contract/SendOptions';
import type { Result } from '@Http/Contract/Result';
import type { Sender } from '@Http/Contract/Sender';

describe('FluentRequest should pass the same listeners from options as from chain methods', () => {
    let send: Mock<(...args: [string, RequestInit, SendOptions]) => Promise<Result<unknown>>>;

    beforeEach(() => {
        send = vi
            .fn<(...args: [string, RequestInit, SendOptions]) => Promise<Result<unknown>>>()
            .mockResolvedValue({ data: null, error: null });
    });

    it('when onUploadProgress and onDownloadProgress come in the options object', async () => {
        const sender = { send } as unknown as Sender;
        const target = { method: 'POST', url: '/api/files' };
        const onUploadProgress = vi.fn();
        const onDownloadProgress = vi.fn();

        await new FluentRequest<unknown>(sender, { ...target, options: { onUploadProgress, onDownloadProgress } });
        await new FluentRequest<unknown>(sender, { ...target, options: {} })
            .onUploadProgress(onUploadProgress)
            .onDownloadProgress(onDownloadProgress);

        const [[, , fromOptions], [, , fromChain]] = send.mock.calls;
        expect(fromOptions).toEqual(expect.objectContaining({ onUploadProgress, onDownloadProgress }));
        expect(fromChain).toEqual(fromOptions);
    });
});
