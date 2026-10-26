import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import FluentRequest from '@Http/Request/FluentRequest';
import type { Result } from '@Http/Contract/Result';
import type { Sender } from '@Http/Contract/Sender';

describe('FluentRequest.query should merge the parameters, the later value winning', () => {
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

    it('when query is set twice', async () => {
        await request.query({ page: 1, sort: 'name' }).query({ page: 2 });

        const [[url]] = send.mock.calls;
        expect(url).toBe('https://api.example.com/users?page=2&sort=name');
    });
});
