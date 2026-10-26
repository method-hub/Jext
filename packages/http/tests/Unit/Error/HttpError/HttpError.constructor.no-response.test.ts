import { describe, expect, it } from 'vitest';
import HttpError from '@Http/Error/HttpError';

describe('HttpError should keep the original error as cause', () => {
    it('when the request got no response', () => {
        const cause = new TypeError('Failed to fetch');

        const error = new HttpError<unknown>('The request got no response', {
            status: 0,
            response: null,
            data: null,
            cause,
        });

        expect(error.status).toBe(0);
        expect(error.response).toBeNull();
        expect(error.data).toBeNull();
        expect(error.cause).toBe(cause);
    });
});
