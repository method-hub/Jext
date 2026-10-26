import type { Data } from '@Http/Contract/Data';

/**
 * @summary Defines the contract for a content-type parser/decoder.
 *
 * @description Each decoder determines whether it can handle a given
 * response type and wraps the response into the appropriate data format.
 */
export interface Decoder<T> {
    /**
     * @summary Answers whether this decoder handles the response.
     *
     * @param data - The response with its Content-Type and Content-Disposition already read.
     * @returns `true` when this decoder should decode the response.
     */
    parse(data: Data): boolean | Promise<boolean>;

    /**
     * @summary Decodes the body of the response.
     *
     * @param response - The response accepted by `parse()`.
     * @returns The decoded body.
     */
    wrap(response: Response): Promise<T>;
}
