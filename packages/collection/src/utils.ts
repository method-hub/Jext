import { isArray, isMap, isObject, isSet, isWeakMap, isWeakSet } from '@Collection/types';

/**
 * @summary Deep-copies a value with `structuredClone`.
 *
 * @description Primitives, `WeakMap` and `WeakSet` are returned as they are: they are immutable or cannot be copied.
 *
 * @param value - The value to copy.
 * @returns A deep copy of the value.
 */
export function clone<T extends Date | RegExp | Map<unknown, unknown> | Set<unknown>>(value: T): T;
/**
 * @summary Deep-copies an array.
 *
 * @param value - The array to copy.
 * @returns A deep copy of the array.
 */
export function clone<T>(value: ReadonlyArray<T>): T[];
/**
 * @summary Deep-copies an object.
 *
 * @param value - The object to copy.
 * @returns A deep copy of the object.
 */
export function clone<T extends object>(value: T): T;
/**
 * @summary Deep-copies any value.
 *
 * @param value - The value to copy.
 * @returns A deep copy of the value.
 */
export function clone<T>(value: T): T;
/**
 * @summary Implementation of `clone`.
 *
 * @param value - The value to copy.
 * @returns A deep copy of the value.
 */
export function clone<T>(value: T): T {
    if (!isObject(value) || isWeakMap(value) || isWeakSet(value)) {
        return value;
    }

    return structuredClone(value);
}

/**
 * @summary A value that `String()` writes as its own text, not as `[object Object]`.
 */
type Primitive = string | number | boolean | bigint | symbol;

const XML_NAME = /^[A-Za-z_][\w.-]*$/u;

const XML_ENTITIES: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' };

/**
 * @summary Escapes the five XML special characters of a text.
 *
 * @param text - The text to escape.
 * @returns The text that is safe inside an element or an attribute.
 */
export function escapeXml(text: string): string {
    return text.replace(/[&<>"']/gu, (character) => XML_ENTITIES[character]);
}

/**
 * @summary Serializes a value into an XML element.
 *
 * @description Arrays and sets become repeated `item` elements, objects and maps become one element per key,
 * `null` and `undefined` become an empty element, every other value becomes escaped text. No XML declaration is
 * added.
 *
 * @param name - The element name.
 * @param value - The value to serialize.
 * @param item - The element name of array and set items.
 * @returns The XML text.
 * @throws TypeError when `name`, `item` or an object key is not a valid XML element name.
 */
export function toXml(name: string, value: unknown, item: string = 'item'): string {
    if (!XML_NAME.test(name)) {
        throw new TypeError(`"${name}" is not a valid XML element name`);
    }

    if (value === null || typeof value === 'undefined') {
        return `<${name}/>`;
    }

    return `<${name}>${xmlBody(value, item)}</${name}>`;
}

/**
 * @summary Serializes the content of an XML element.
 *
 * @param value - The value inside the element.
 * @param item - The element name of array and set items.
 * @returns The XML text without the enclosing element.
 */
function xmlBody(value: unknown, item: string): string {
    if (isArray(value) || isSet(value)) {
        return [...value].map((element) => toXml(item, element, item)).join('');
    }

    if (isMap(value)) {
        return [...value].map(([key, element]) => toXml(String(key as Primitive), element, item)).join('');
    }

    if (isObject(value)) {
        return Object.entries(value)
            .map(([key, element]) => toXml(key, element, item))
            .join('');
    }

    return escapeXml(String(value as Primitive));
}
