import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import FluentRequest from '@Http/Request/FluentRequest';
import type { Result } from '@Http/Contract/Result';
import type { Sender } from '@Http/Contract/Sender';

describe('FluentRequest.body should keep the Content-Type set by the caller', () => {
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

    it('when the caller set Content-Type', async () => {
        await request.headers({ 'Content-Type': 'application/vnd.api+json' }).body({ name: 'Alice' });

        const [[, init]] = send.mock.calls;
        expect(new Headers(init.headers).get('Content-Type')).toBe('application/vnd.api+json');
    });
});
