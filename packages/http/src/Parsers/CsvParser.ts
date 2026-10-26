import type { Decoder } from '@Http/Contract/Decoder';
import type { Data } from '@Http/Contract/Data';

const TSV_TYPE = 'text/tab-separated-values';

/**
 * @summary Decoder for CSV and TSV content types.
 *
 * @description Splits the body into rows of fields following RFC 4180: quoted fields may contain the delimiter,
 * line breaks and doubled quotes (`""`). A quote that is never closed keeps the rest of the body as one field.
 * `text/tab-separated-values` uses a tab as the delimiter.
 */
export default class CsvParser implements Decoder<string[][]> {
    /**
     * @summary Accepts `text/csv`, `application/csv` and `text/tab-separated-values`.
     *
     * @param data - The response with its Content-Type and Content-Disposition already read.
     * @returns `true` when this decoder handles the response.
     */
    public parse({ contentType }: Data): boolean {
        return (
            contentType.startsWith('text/csv') ||
            contentType.startsWith('application/csv') ||
            contentType.startsWith(TSV_TYPE)
        );
    }

    /**
     * @summary Splits the body into rows of fields; a TSV body is split by tabs.
     *
     * @param response - The accepted response.
     * @returns The rows, each an array of fields.
     */
    public async wrap(response: Response): Promise<string[][]> {
        const contentType = (response.headers.get('content-type') || '').toLowerCase();
        const delimiter = contentType.startsWith(TSV_TYPE) ? '\t' : ',';

        return this.rows(await response.text(), delimiter);
    }

    /**
     * @summary Splits text into rows following RFC 4180: a quoted field may hold the delimiter, line breaks and `""`.
     *
     * @param text - The body.
     * @param delimiter - `,` for CSV, a tab for TSV.
     * @returns The rows, each an array of fields.
     */
    private rows(text: string, delimiter: string): string[][] {
        const pattern = new RegExp(
            `(?<field>"(?<quoted>(?:[^"]|"")*)(?:"|$)|[^"${delimiter}\\r\\n]*)(?<end>${delimiter}|\\r?\\n|$)`,
            'g'
        );
        const rows: string[][] = [];
        let row: string[] = [];

        for (const { groups } of text.matchAll(pattern)) {
            if (groups.end === '' && groups.field === '' && row.length === 0) {
                break;
            }

            row.push(typeof groups.quoted === 'string' ? groups.quoted.replace(/""/g, '"') : groups.field);

            if (groups.end !== delimiter) {
                rows.push(row);
                row = [];
            }

            if (groups.end === '') {
                break;
            }
        }

        return rows;
    }
}
