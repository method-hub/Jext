import { describe, expect, it } from 'vitest';
import ObjectExtensions from '@Collection/Object/ObjectExtensions';

describe('ObjectRoot.toString should write key: value pairs', () => {
    it('when no separator is given', () => {
        const sut = ObjectExtensions.of<{ a: number; b: string }>({ a: 1, b: 'x' });

        const result = sut.toString();

        expect(result).toEqual('a: 1, b: x');
    });
});
