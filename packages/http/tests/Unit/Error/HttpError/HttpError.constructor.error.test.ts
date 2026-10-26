import { describe, expect, it } from 'vitest';
import HttpError from '@Http/Error/HttpError';

describe('HttpError should be an Error named HttpError', () => {
    it('when it is created', () => {
        const error = new HttpError<unknown>('500 Internal Server Error', { status: 500, response: null, data: null });

        expect(error).toBeInstanceOf(Error);
        expect(error).toBeInstanceOf(HttpError);
        expect(error.name).toBe('HttpError');
        expect(error.stack).toContain('HttpError');
    });
});
