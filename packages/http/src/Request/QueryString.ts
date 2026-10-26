import type { Query, QueryValue } from '@Http/Contract/Query';

/**
 * @summary Appends query parameters to a URL.
 */
export default class QueryString {
    /**
     * @summary Returns `url` with `query` appended after its own parameters and before its `#fragment`.
     *
     * @description Values are encoded, `null` and `undefined` are skipped, an array repeats the key.
     *
     * @param url - The URL, maybe with its own parameters and a fragment.
     * @param query - The parameters to add.
     * @returns The URL with the parameters.
     */
    public static append(url: string, query: Query): string {
        const search = QueryString.encode(query);

        if (search === '') {
            return url;
        }

        const hashAt = url.indexOf('#');
        const base = hashAt === -1 ? url : url.slice(0, hashAt);
        const hash = hashAt === -1 ? '' : url.slice(hashAt);
        const separator = QueryString.separator(base);

        return `${base}${separator}${search}${hash}`;
    }

    /**
     * @summary Encodes the parameters, leaving out `null` and `undefined` and repeating the key for an array.
     *
     * @param query - The parameters.
     * @returns The encoded parameters without `?`, empty when there are none.
     */
    private static encode(query: Query): string {
        const params = new URLSearchParams();

        for (const [key, value] of Object.entries(query)) {
            const values: readonly QueryValue[] = Array.isArray(value) ? value : [value];

            values
                .filter((item): item is string | number | boolean => item !== null && typeof item !== 'undefined')
                .forEach((item) => params.append(key, String(item)));
        }

        return params.toString();
    }

    /**
     * @summary Picks what goes between the URL and the new parameters.
     *
     * @param base - The URL without its fragment.
     * @returns `?`, `&`, or nothing when the URL already ends with one of them.
     */
    private static separator(base: string): string {
        if (base.endsWith('?') || base.endsWith('&')) {
            return '';
        }

        return base.includes('?') ? '&' : '?';
    }
}
