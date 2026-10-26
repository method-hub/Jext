import { describe, expect, it } from 'vitest';
import ValidationError from '@Http/Error/ValidationError';

describe('ValidationError should use the bare issue message', () => {
    it('when the issue has no path', () => {
        const issues = [{ message: 'Expected an object' }];

        const error = new ValidationError<unknown>(issues, 'text', { status: 200, response: null, data: null });

        expect(error.message).toBe('Expected an object');
    });
});
