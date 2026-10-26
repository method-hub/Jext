import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import FluentRequest from '@Http/Request/FluentRequest';
import type { Result } from '@Http/Contract/Result';
import type { Sender } from '@Http/Contract/Sender';

describe('FluentRequest should send every request built from one prepared request', () => {
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

    it('when two requests share a base', async () => {
        const base = request.headers({ Authorization: 'Bearer t' });

        await Promise.all([base.query({ page: 1 }), base.query({ page: 2 })]);

        expect(send.mock.calls.map(([url]) => url)).toEqual([
            'https://api.example.com/users?page=1',
            'https://api.example.com/users?page=2',
        ]);
        expect(send.mock.calls.every(([, init]) => new Headers(init.headers).get('Authorization') === 'Bearer t')).toBe(
            true
        );
    });
});
