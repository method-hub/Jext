import { describe, expect, it } from 'vitest';
import ValidationError from '@Http/Error/ValidationError';

describe('ValidationError should count the other issues in its message', () => {
    it('when the schema found three issues', () => {
        const issues = [
            { message: 'Expected number', path: ['id'] },
            { message: 'Expected string', path: ['name'] },
            { message: 'Required', path: ['email'] },
        ];

        const error = new ValidationError<unknown>(issues, {}, { status: 200, response: null, data: null });

        expect(error.message).toBe('id: Expected number (and 2 more)');
    });
});
