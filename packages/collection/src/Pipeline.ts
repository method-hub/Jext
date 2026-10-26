import Value from '@Collection/Value';

/**
 * @summary A condition of `when`, `unless`, `alt` and `cond`: a boolean or a predicate over the wrapped value.
 *
 * @template T - The type of the wrapped value.
 */
export type Condition<T> = boolean | ((value: T) => boolean);

/**
 * @summary A step of a chain: receives the wrapper and returns a wrapper of the same kind.
 *
 * @template W - The wrapper type.
 */
export type Step<W> = (self: W) => W;

/**
 * @summary One branch of `cond`: a condition and the step that runs when it matches.
 *
 * @template T - The type of the wrapped value.
 * @template W - The wrapper type.
 */
export type Case<T, W> = readonly [Condition<T>, Step<W>];

/**
 * @summary Abstract base class of every typed pipeline.
 *
 * @description Holds the conditional and side-effect methods shared by all value types. Callbacks receive the
 * wrapper itself, not the raw value, so all methods of the type are available inside them and the chain keeps its
 * type: `when` on an `ArrayExtensions<T>` returns an `ArrayExtensions<T>`. Conditions receive the raw value and
 * must not change it.
 *
 * @template T - The type of the wrapped value.
 * @template W - The wrapper type the conditional methods return, for example `ArrayExtensions<T>`.
 *
 * @example
 * collection([3, 1, 2]).when((array) => array.length > 2, (self) => self.filter((n) => n > 1)).get(); // [3, 2]
 */
export default abstract class Pipeline<T, W> extends Value<T> {
    /**
     * @summary Executes a side effect with the current value without changing the chain.
     *
     * @description Useful for logging or debugging in the middle of a chain. The logger must not change the value.
     *
     * @param logger - Receives the wrapped value; `console.log` by default.
     * @returns The same wrapper instance.
     *
     * @example
     * collection([1, 2]).tap(console.info).map((item) => item * 2);
     */
    public tap(logger: (value: T) => void = console.log): this {
        logger(this.value);
        return this;
    }

    /**
     * @summary Runs `callback` with the wrapper when `condition` holds.
     *
     * @param condition - A boolean or a predicate over the wrapped value.
     * @param callback - Receives the wrapper and returns the next wrapper.
     * @returns The result of `callback` when the condition holds, otherwise the same wrapper.
     *
     * @example
     * collection([3, 1, 2]).when(isSorted, (self) => self.map((item) => item * 2)).get();
     */
    public when(condition: Condition<T>, callback: Step<W>): W {
        return this.holds(condition) ? callback(this.self()) : this.self();
    }

    /**
     * @summary Runs `callback` with the wrapper when `condition` does not hold.
     *
     * @description The inverse of `when`.
     *
     * @param condition - A boolean or a predicate over the wrapped value.
     * @param callback - Receives the wrapper and returns the next wrapper.
     * @returns The result of `callback` when the condition does not hold, otherwise the same wrapper.
     *
     * @example
     * collection(users).unless((list) => list.length > 0, () => collection(defaults)).get();
     */
    public unless(condition: Condition<T>, callback: Step<W>): W {
        return this.holds(condition) ? this.self() : callback(this.self());
    }

    /**
     * @summary Runs one of two callbacks depending on `condition`.
     *
     * @description Always runs exactly one callback: `left` when the condition holds, `right` otherwise.
     *
     * @param condition - A boolean or a predicate over the wrapped value.
     * @param left - Runs when the condition holds.
     * @param right - Runs when the condition does not hold.
     * @returns The result of the callback that ran.
     *
     * @example
     * collection(5).alt((n) => n > 0, (self) => self.clamp(0, 3), (self) => self.clamp(-3, 0)).get(); // 3
     */
    public alt(condition: Condition<T>, left: Step<W>, right: Step<W>): W {
        return this.holds(condition) ? left(this.self()) : right(this.self());
    }

    /**
     * @summary Runs the step of the first case whose condition holds.
     *
     * @description Cases are pairs of a condition and a step, checked in order. When none holds, `otherwise` runs;
     * without `otherwise` the same wrapper is returned.
     *
     * @param cases - Pairs of a condition and the step to run when it holds.
     * @param otherwise - Runs when no condition holds; returns the wrapper unchanged by default.
     * @returns The result of the step that ran.
     *
     * @example
     * collection(150).cond([[(n) => n > 100, (self) => self.clamp(0, 100)]]).get(); // 100
     */
    public cond(cases: ReadonlyArray<Case<T, W>>, otherwise: Step<W> = (self) => self): W {
        const match = cases.find(([condition]) => this.holds(condition));
        return match ? match[1](this.self()) : otherwise(this.self());
    }

    /**
     * @summary Returns this instance typed as the concrete wrapper.
     *
     * @returns The same instance, typed as `W`.
     */
    protected abstract self(): W;

    /**
     * @summary Evaluates a condition against the wrapped value.
     *
     * @param condition - A boolean or a predicate over the wrapped value.
     * @returns Whether the condition holds.
     */
    private holds(condition: Condition<T>): boolean {
        return typeof condition === 'function' ? condition(this.value) : condition;
    }
}
