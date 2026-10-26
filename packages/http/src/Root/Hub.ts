import type { Decoder } from '@Http/Contract/Decoder';

/**
 * @summary Abstract registry for Decoder objects.
 *
 * @description Stores parsers by class name in insertion order.
 * Subclasses define how the registered parsers are used.
 */
export default abstract class Hub<T> {
    private readonly registry: Map<string, Decoder<T>> = new Map();

    /**
     * @summary Registers a parser in the registry.
     *
     * @description A parser of the same class replaces the one registered before, keeping its place.
     *
     * @param parser - The parser to add.
     * @returns The same registry.
     */
    public add(parser: Decoder<T>): this {
        this.registry.set(parser.constructor.name, parser);
        return this;
    }

    /**
     * @summary Removes a parser from the registry.
     *
     * @description The parser is found by its class name, so any instance of the class removes it.
     *
     * @param parser - The parser to remove.
     * @returns The same registry.
     */
    public remove(parser: Decoder<T>): this {
        this.registry.delete(parser.constructor.name);
        return this;
    }

    /**
     * @summary Returns the registered parsers.
     */
    public get parsers(): Map<string, Decoder<T>> {
        return this.registry;
    }
}
