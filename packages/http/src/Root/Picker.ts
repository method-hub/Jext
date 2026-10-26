import type { Data } from '@Http/Contract/Data';
import type { Decoder } from '@Http/Contract/Decoder';
import type { Format } from '@Http/Contract/Format';

/**
 * @summary Decodes a response with the decoder of a format the caller chose, skipping Content-Type detection.
 *
 * @description Used by `.as(format)`. A response without a body still decodes to `null` through the empty
 * decoder, so `.as('json')` on a 204 does not fail. `Bootstrap` builds it from the same decoder instances as the
 * chain.
 */
export default class Picker {
    private readonly empty: Decoder<unknown>;
    private readonly decoders: Readonly<Record<Format, Decoder<unknown>>>;

    constructor(empty: Decoder<unknown>, decoders: Readonly<Record<Format, Decoder<unknown>>>) {
        this.empty = empty;
        this.decoders = decoders;
    }

    /**
     * @summary Returns the body decoded as `format`, or `null` when the response has no body.
     *
     * @param response - The 2xx response.
     * @param format - The format given to `.as()`.
     * @returns The decoded body.
     */
    public async decode(response: Response, format: Format): Promise<unknown> {
        const data: Data = {
            response,
            contentType: (response.headers.get('content-type') || '').toLowerCase(),
            disposition: (response.headers.get('content-disposition') || '').toLowerCase(),
        };

        if (await this.empty.parse(data)) {
            return this.empty.wrap(response);
        }

        return this.decoders[format].wrap(response);
    }
}
