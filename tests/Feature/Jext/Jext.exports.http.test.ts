import { describe, expect, it } from 'vitest';
import { http, HttpError, ValidationError } from '../../../packages/jext/index';

describe('Jext.exports should expose the http client and its errors', () => {
    it('when the aggregator is imported', () => {
        const exported = { http, HttpError, ValidationError };

        const kinds = [typeof exported.http.get, typeof exported.HttpError, typeof exported.ValidationError];

        expect(kinds).toEqual(['function', 'function', 'function']);
    });
});
