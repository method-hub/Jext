import { describe, expect, it } from 'vitest';
import ValidationError from '@Http/Error/ValidationError';
import HttpError from '@Http/Error/HttpError';

describe('ValidationError should be an HttpError that keeps the issues and the value', () => {
    it('when it is created', () => {
        const response = new Response('{"id":"1"}');
        const issues = [{ message: 'Expected number', path: ['id'] }];

        const error = new ValidationError<unknown>(issues, { id: '1' }, { status: 200, response, data: null });

        expect(error).toBeInstanceOf(Error);
        expect(error).toBeInstanceOf(HttpError);
        expect(error.name).toBe('ValidationError');
        expect(error.issues).toEqual(issues);
        expect(error.value).toEqual({ id: '1' });
        expect(error.status).toBe(200);
        expect(error.response).toBe(response);
        expect(error.data).toBeNull();
    });
});
