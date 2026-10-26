import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import FluentRequest from '@Http/Request/FluentRequest';
import type { Result } from '@Http/Contract/Result';
import type { Sender } from '@Http/Contract/Sender';

describe('FluentRequest.body should send an object as JSON', () => {
    let send: Mock<(...args: [string, RequestInit]) => Promise<Result<string>>>;
    let request: FluentRequest<string>;

    beforeEach(() => {
        send = vi
            .fn<(...args: [string, RequestInit]) => Promise<Result<string>>>()
            .mockResolvedValue({ data: 'ok', error: null });
        request = new FluentRequest<string>({ send } as unknown as Sender, {
            method: 'POST',
            url: 'https://api.example.com/users',
            options: {},
        });
    });

    it('when the body is a plain object', async () => {
        await request.body({ name: 'Alice' });

        const [[, init]] = send.mock.calls;
        expect(init.body).toBe('{"name":"Alice"}');
        expect(new Headers(init.headers).get('Content-Type')).toBe('application/json');
    });
});
