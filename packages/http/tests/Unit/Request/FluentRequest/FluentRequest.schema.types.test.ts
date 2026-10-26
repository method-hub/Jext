import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import FluentRequest from '@Http/Request/FluentRequest';
import type { Decoding } from '@Http/Contract/Decoding';
import type { Result } from '@Http/Contract/Result';
import type { Sender } from '@Http/Contract/Sender';
import type { HttpRequest } from '@Http/Contract/HttpRequest';
import type { StandardSchema } from '@Http/Contract/StandardSchema';

describe('FluentRequest.schema should infer the type of the data from the schema', () => {
    let send: Mock<(...args: [string, RequestInit, Decoding]) => Promise<Result<unknown>>>;
    let request: FluentRequest<{ id: number }>;

    beforeEach(() => {
        send = vi
            .fn<(...args: [string, RequestInit, Decoding]) => Promise<Result<unknown>>>()
            .mockResolvedValue({ data: null, error: null });
        request = new FluentRequest<{ id: number }>({ send } as unknown as Sender, {
            method: 'GET',
            url: 'https://api.example.com/users',
            options: {},
        });
    });

    it('when a typed schema is given', () => {
        const schema: StandardSchema<unknown, { name: string }> = {
            '~standard': { version: 1, vendor: 'test', validate: (value) => ({ value: value as { name: string } }) },
        };

        const named: HttpRequest<{ name: string }> = request.schema(schema);
        // @ts-expect-error: the schema returns { name: string }, the type given to the request is gone
        const wrong: HttpRequest<{ id: number }> = request.schema(schema);

        expect([named, wrong]).toHaveLength(2);
    });
});
