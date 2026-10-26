import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import FluentRequest from '@Http/Request/FluentRequest';
import HttpError from '@Http/Error/HttpError';
import type { Result } from '@Http/Contract/Result';
import type { Sender } from '@Http/Contract/Sender';

describe('FluentRequest.then should resolve with an HttpError and send nothing', () => {
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

    it('when the body cannot be serialized to JSON', async () => {
        const circular: { self?: object } = {};
        circular.self = circular;

        const { data, error } = await request.body(circular);

        expect(send).not.toHaveBeenCalled();
        expect(data).toBeNull();
        expect(error).toBeInstanceOf(HttpError);
        expect(error?.status).toBe(0);
        expect(error?.cause).toBeInstanceOf(TypeError);
    });
});
