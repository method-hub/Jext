import { describe, expect, it } from 'vitest';
import ObjectExtensions from '@Collection/Object/ObjectExtensions';

describe('Pipeline.when should execute the callback', () => {
    it('when the condition is true for an object', () => {
        const utils = ObjectExtensions.of<{ name: string; age?: number }>({ name: 'Dan' });

        const result = utils.when(
            (object) => object.name === 'Dan',
            (self) => self.transform<{ name: string; age?: number }>((object) => ({ ...object, age: 34 }))
        );

        expect(result.get()).toEqual({ name: 'Dan', age: 34 });
        expect(result).toBeInstanceOf(ObjectExtensions);
    });
});
