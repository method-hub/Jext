import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import FluentRequest from '@Http/Request/FluentRequest';
import type { Decoding } from '@Http/Contract/Decoding';
import type { Result } from '@Http/Contract/Result';
import type { Sender } from '@Http/Contract/Sender';
import type { StandardSchema } from '@Http/Contract/StandardSchema';

describe('FluentRequest should pass the same format and schema from options as from chain methods', () => {
    let send: Mock<(...args: [string, RequestInit, Decoding]) => Promise<Result<unknown>>>;

    beforeEach(() => {
        send = vi
            .fn<(...args: [string, RequestInit, Decoding]) => Promise<Result<unknown>>>()
            .mockResolvedValue({ data: null, error: null });
    });

    it('when as and schema come in the options object', async () => {
        const sender = { send } as unknown as Sender;
        const target = { method: 'GET', url: '/api/users' };
        const schema: StandardSchema = {
            '~standard': { version: 1, vendor: 'test', validate: (value) => ({ value }) },
        };

        await new FluentRequest<unknown>(sender, { ...target, options: { as: 'json', schema } });
        await new FluentRequest<unknown>(sender, { ...target, options: {} }).as('json').schema(schema);

        const [[, , fromOptions], [, , fromChain]] = send.mock.calls;
        expect(fromOptions).toEqual({ format: 'json', schema });
        expect(fromChain).toEqual(fromOptions);
    });
});
