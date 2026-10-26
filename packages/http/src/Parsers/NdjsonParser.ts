import type { Decoder } from '@Http/Contract/Decoder';
import type { Data } from '@Http/Contract/Data';

const NDJSON_TYPES = [
    'application/x-ndjson',
    'application/ndjson',
    'application/jsonlines',
    'application/x-jsonlines',
    'application/jsonl',
];

/**
 * @summary Decoder for newline-delimited JSON (NDJSON, JSON Lines).
 *
 * @description Parses every non-empty line as a separate JSON value and returns them as an array.
 *
 * @template T - The type of one parsed line.
 */
export default class NdjsonParser<T> implements Decoder<T[]> {
    /**
     * @summary Accepts `application/x-ndjson`, `application/ndjson`, `application/jsonlines`,
     * `application/x-jsonlines` and `application/jsonl`.
     *
     * @param data - The response with its Content-Type and Content-Disposition already read.
     * @returns `true` when this decoder handles the response.
     */
    public parse({ contentType }: Data): boolean {
        return NDJSON_TYPES.some((type) => contentType.startsWith(type));
    }

    /**
     * @summary Parses every non-empty line as one JSON value.
     *
     * @param response - The accepted response.
     * @returns The values in the order of the lines.
     */
    public async wrap(response: Response): Promise<T[]> {
        const text = await response.text();

        return text
            .split(/\r?\n/)
            .filter((line) => line.trim() !== '')
            .map((line) => JSON.parse(line) as T);
    }
}
