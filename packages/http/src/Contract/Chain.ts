import type { Decoder } from '@Http/Contract/Decoder';

/**
 * @summary Defines the contract for the parser chain (Chain of Responsibility).
 *
 * @description Decoders are asked in order; the first one that accepts the response decodes it.
 */
export interface Chain<T> {
    /**
     * @summary Appends a decoder to the end of the chain, so it is asked after the ones already there.
     *
     * @param parser - The decoder to add.
     * @returns The same chain.
     */
    add(parser: Decoder<T>): this;

    /**
     * @summary Removes a decoder from the chain; a decoder that is not in the chain is ignored.
     *
     * @param parser - The decoder to remove.
     * @returns The same chain.
     */
    remove(parser: Decoder<T>): this;

    /**
     * @summary Decodes the response with the first decoder that accepts it.
     *
     * @param response - The response to decode.
     * @returns The decoded body; an `ArrayBuffer` when no decoder accepts the response.
     */
    decode(response: Response): Promise<T>;
}
