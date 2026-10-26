import { describe, expect, it } from 'vitest';
import HttpError from '@Http/Error/HttpError';

describe('HttpError should keep what it knows about the response', () => {
    it('when it is built for an error status', () => {
        const response = new Response(null, { status: 404, statusText: 'Not Found' });

        const error = new HttpError<{ message: string }>('404 Not Found', {
            status: 404,
            response,
            data: { message: 'User not found' },
        });

        expect(error.message).toBe('404 Not Found');
        expect(error.status).toBe(404);
        expect(error.response).toBe(response);
        expect(error.data).toEqual({ message: 'User not found' });
        expect(error.cause).toBeUndefined();
    });
});
