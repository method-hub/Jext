import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import FluentRequest from '@Http/Request/FluentRequest';
import type { Result } from '@Http/Contract/Result';
import type { Sender } from '@Http/Contract/Sender';

describe('FluentRequest.headers should merge the headers, the later value winning', () => {
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

    it('when headers are set twice', async () => {
        await request.headers({ 'X-A': '1', 'X-B': '1' }).headers({ 'X-B': '2' });

        const [[, init]] = send.mock.calls;
        const headers = new Headers(init.headers);
        expect(headers.get('X-A')).toBe('1');
        expect(headers.get('X-B')).toBe('2');
    });
});
