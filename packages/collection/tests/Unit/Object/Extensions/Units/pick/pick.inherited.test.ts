import { describe, expect, it } from 'vitest';
import { pick } from '@Collection/Object/extensions';

describe('pick should not copy inherited properties', () => {
    it('when a key exists only on the prototype', () => {
        const object: { a: number; toString: () => string } = { a: 1 } as { a: number; toString: () => string };

        const result = pick(object, ['toString']);

        expect(Object.keys(result)).toEqual([]);
    });
});
