import type { Format } from '@Http/Contract/Format';
import type { StandardSchema } from '@Http/Contract/StandardSchema';

/**
 * @summary How `send()` turns a successful response into data.
 */
export interface Decoding {
    /** Decode with this format instead of detecting it from Content-Type. */
    format?: Format;
    /** Validate the decoded data with this schema; a mismatch becomes a `ValidationError`. */
    schema?: StandardSchema;
}
