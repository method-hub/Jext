import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import FluentRequest from '@Http/Request/FluentRequest';
import type { Decoding } from '@Http/Contract/Decoding';
import type { Result } from '@Http/Contract/Result';
import type { Sender } from '@Http/Contract/Sender';
import type { HttpRequest } from '@Http/Contract/HttpRequest';

describe('FluentRequest.as should change the type of the data', () => {
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

    it('when a format with a fixed type is chosen', () => {
        const rows: HttpRequest<string[][]> = request.as('csv');
        const json: HttpRequest<{ id: number }> = request.as('json');
        // @ts-expect-error: csv decodes to string[][], not to the type given to the request
        const wrong: HttpRequest<{ id: number }> = request.as('csv');
        // @ts-expect-error: there is no such format
        const unknown = request.as('yaml');

        expect([rows, json, wrong, unknown]).toHaveLength(4);
    });
});
