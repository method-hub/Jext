import { describe, expect, it } from 'vitest';
import ObjectExtensions from '@Collection/Object/ObjectExtensions';

describe('Pipeline.alt should execute the right branch', () => {
    it('when the condition is false for an object', () => {
        const utils = ObjectExtensions.of<{ name: string; age?: number }>({ name: 'Dan' });

        const result = utils.alt(
            (object) => object.name === 'Ann',
            (self) => self.transform<{ name: string; age?: number }>((object) => ({ ...object, age: 34 })),
            (self) => self.transform<{ name: string; age?: number }>((object) => ({ ...object, age: 0 }))
        );

        expect(result.get()).toEqual({ name: 'Dan', age: 0 });
        expect(result).toBeInstanceOf(ObjectExtensions);
    });
});
