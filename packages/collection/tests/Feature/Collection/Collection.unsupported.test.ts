import { describe, expect, it } from 'vitest';
import collection from '@metapraxis/jext-collection';

describe('collection should return undefined', () => {
    it.each([true, null, 10n])('when the value is %p', (value) => {
        const input: unknown = value;

        const result = (collection as (value: unknown) => unknown)(input);

        expect(result).toBeUndefined();
    });
});
