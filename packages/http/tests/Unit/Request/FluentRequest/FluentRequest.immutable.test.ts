import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import FluentRequest from '@Http/Request/FluentRequest';
import type { Result } from '@Http/Contract/Result';
import type { Sender } from '@Http/Contract/Sender';

describe('FluentRequest should leave the original request unchanged', () => {
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

    it('when a chain method is called on it', async () => {
        const linked = request.headers({ 'X-A': '1' }).query({ page: 1 });

        await request;

        const [[url, init]] = send.mock.calls;
        expect(linked).not.toBe(request);
        expect(url).toBe('https://api.example.com/users');
        expect(new Headers(init.headers).has('X-A')).toBe(false);
    });
});
