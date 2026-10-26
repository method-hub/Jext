import { describe, expect, it } from 'vitest';
import ValidationError from '@Http/Error/ValidationError';

describe('ValidationError should fall back to a general message', () => {
    it('when the list of issues is empty', () => {
        const error = new ValidationError<unknown>([], {}, { status: 200, response: null, data: null });

        expect(error.message).toBe('The response did not match the schema');
        expect(error.issues).toEqual([]);
    });
});
