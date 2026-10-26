/**
 * @summary Represents the parsed context of an HTTP response
 * passed to each Decoder for content negotiation.
 */
export interface Data {
    /** The response being decoded; a decoder that reads its body must read a `clone()`. */
    response: Response;
    /** The `Content-Type` header in lower case, empty when the header is absent. */
    contentType: string;
    /** The `Content-Disposition` header in lower case, empty when the header is absent. */
    disposition: string;
}
