/**
 * @summary Checks that a value is a string.
 *
 * @param value - The value to check.
 * @returns `true` when the value is a string.
 */
export function isString(value: unknown): value is string {
    return typeof value === 'string';
}

/**
 * @summary Checks that a value is a number, `NaN` included.
 *
 * @param value - The value to check.
 * @returns `true` when the value is a number.
 */
export function isNumber(value: unknown): value is number {
    return typeof value === 'number';
}

/**
 * @summary Checks that a value is a boolean.
 *
 * @param value - The value to check.
 * @returns `true` when the value is a boolean.
 */
export function isBoolean(value: unknown): value is boolean {
    return typeof value === 'boolean';
}

/**
 * @summary Checks that a value is a function.
 *
 * @param value - The value to check.
 * @returns `true` when the value is a function.
 */
// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export function isFunction(value: unknown): value is Function {
    return typeof value === 'function';
}

/**
 * @summary Checks that a value is a non-null object, arrays and other built-ins included.
 *
 * @param value - The value to check.
 * @returns `true` when the value is a non-null object.
 */
export function isObject(value: unknown): value is object {
    return typeof value === 'object' && value !== null;
}

/**
 * @summary Checks that a value is `null`.
 *
 * @param value - The value to check.
 * @returns `true` when the value is `null`.
 */
export function isNull(value: unknown): value is null {
    return value === null;
}

/**
 * @summary Checks that a value is `undefined`.
 *
 * @param value - The value to check.
 * @returns `true` when the value is `undefined`.
 */
export function isUndefined(value: unknown): value is undefined {
    return typeof value === 'undefined';
}

/**
 * @summary Checks that a value is a symbol.
 *
 * @param value - The value to check.
 * @returns `true` when the value is a symbol.
 */
export function isSymbol(value: unknown): value is symbol {
    return typeof value === 'symbol';
}

/**
 * @summary Checks that a value is a bigint.
 *
 * @param value - The value to check.
 * @returns `true` when the value is a bigint.
 */
export function isBigInt(value: unknown): value is bigint {
    return typeof value === 'bigint';
}

/**
 * @summary Checks that a value is a `Date`.
 *
 * @param value - The value to check.
 * @returns `true` when the value is a `Date`.
 */
export function isDate(value: unknown): value is Date {
    return value instanceof Date;
}

/**
 * @summary Checks that a value is a `RegExp`.
 *
 * @param value - The value to check.
 * @returns `true` when the value is a `RegExp`.
 */
export function isRegExp(value: unknown): value is RegExp {
    return value instanceof RegExp;
}

/**
 * @summary Checks that a value is an `Error`.
 *
 * @param value - The value to check.
 * @returns `true` when the value is an `Error`.
 */
export function isError(value: unknown): value is Error {
    return value instanceof Error;
}

/**
 * @summary Checks that a value is a `Map`.
 *
 * @param value - The value to check.
 * @returns `true` when the value is a `Map`.
 */
export function isMap(value: unknown): value is Map<unknown, unknown> {
    return value instanceof Map;
}

/**
 * @summary Checks that a value is a `Set`.
 *
 * @param value - The value to check.
 * @returns `true` when the value is a `Set`.
 */
export function isSet(value: unknown): value is Set<unknown> {
    return value instanceof Set;
}

/**
 * @summary Checks that a value is a `WeakMap`.
 *
 * @param value - The value to check.
 * @returns `true` when the value is a `WeakMap`.
 */
export function isWeakMap(value: unknown): value is WeakMap<object, unknown> {
    return value instanceof WeakMap;
}

/**
 * @summary Checks that a value is a `WeakSet`.
 *
 * @param value - The value to check.
 * @returns `true` when the value is a `WeakSet`.
 */
export function isWeakSet(value: unknown): value is WeakSet<object> {
    return value instanceof WeakSet;
}

/**
 * @summary Checks that a value is an array.
 *
 * @param value - The value to check.
 * @returns `true` when the value is an array.
 */
export function isArray(value: unknown): value is Array<unknown> {
    return Array.isArray(value);
}

/**
 * @summary Checks that none of the values is `undefined`.
 *
 * @param value - The first value to check.
 * @param values - More values to check.
 * @returns `true` when every value is defined; `null` counts as defined.
 */
export function isDefined(value: unknown, ...values: unknown[]): boolean {
    return [value, ...values].every((val) => typeof val !== 'undefined');
}
