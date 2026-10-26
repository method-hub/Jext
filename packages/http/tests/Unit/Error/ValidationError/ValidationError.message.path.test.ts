import { describe, expect, it } from 'vitest';
import ValidationError from '@Http/Error/ValidationError';

describe('ValidationError should name the path of the first issue in its message', () => {
    it('when the path mixes plain keys and key objects', () => {
        const issues = [{ message: 'Expected string', path: ['users', { key: 0 }, 'name'] }];

        const error = new ValidationError<unknown>(issues, {}, { status: 200, response: null, data: null });

        expect(error.message).toBe('users.0.name: Expected string');
    });
});
