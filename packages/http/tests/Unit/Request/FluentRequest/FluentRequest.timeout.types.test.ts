import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import FluentRequest from '@Http/Request/FluentRequest';
import type { SendOptions } from '@Http/Contract/SendOptions';
import type { Result } from '@Http/Contract/Result';
import type { Sender } from '@Http/Contract/Sender';
import type { BodyRequest } from '@Http/Contract/HttpRequest';

describe('FluentRequest.timeout and retry should keep body() on a request with a body', () => {
    let send: Mock<(...args: [string, RequestInit, SendOptions]) => Promise<Result<unknown>>>;
    let request: FluentRequest<string>;

    beforeEach(() => {
        send = vi
            .fn<(...args: [string, RequestInit, SendOptions]) => Promise<Result<unknown>>>()
            .mockResolvedValue({ data: null, error: null });
        request = new FluentRequest<string>({ send } as unknown as Sender, {
            method: 'GET',
            url: 'https://api.example.com/users',
            options: {},
        });
    });

    it('when they are called after post', () => {
        const post: BodyRequest<string> = request.timeout(5000).retry(2).body({ name: 'Alice' });
        // @ts-expect-error: retry takes a number or RetryOptions, not a string
        const wrong = request.retry('twice');

        expect([post, wrong]).toHaveLength(2);
    });
});
