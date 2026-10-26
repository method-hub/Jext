import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import FluentRequest from '@Http/Request/FluentRequest';
import type { Result } from '@Http/Contract/Result';
import type { Sender } from '@Http/Contract/Sender';

describe('FluentRequest should send its method', () => {
    let send: Mock<(...args: [string, RequestInit]) => Promise<Result<string>>>;
    let request: FluentRequest<string>;

    beforeEach(() => {
        send = vi
            .fn<(...args: [string, RequestInit]) => Promise<Result<string>>>()
            .mockResolvedValue({ data: 'ok', error: null });
        request = new FluentRequest<string>({ send } as unknown as Sender, {
            method: 'DELETE',
            url: 'https://api.example.com/users',
            options: {},
        });
    });

    it('when the request is awaited', async () => {
        await request;

        expect(send).toHaveBeenCalledWith(
            'https://api.example.com/users',
            expect.objectContaining({ method: 'DELETE' }),
            expect.anything()
        );
    });
});
