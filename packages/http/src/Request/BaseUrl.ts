const ABSOLUTE = /^(?:[a-z][a-z\d+.-]*:|\/\/)/i;

/**
 * @summary Joins the `baseUrl` of a client and the URL of a request.
 *
 * @description An absolute URL (`https://…`, `//host/…`, `data:…`) is used as it is. A relative one is appended
 * to the base with exactly one slash between them, so `'https://api.example.com/v2/'` + `'/users'` gives
 * `'https://api.example.com/v2/users'`. Unlike `new URL(path, base)`, a path that starts with `/` does not drop
 * the path of the base.
 */
export default class BaseUrl {
    /**
     * @summary Returns `url` resolved against `base`, or `url` unchanged when there is no base or it is absolute.
     *
     * @param base - The `baseUrl` of the client, `undefined` when it has none.
     * @param url - The URL of the request.
     * @returns The URL to send.
     */
    public static resolve(base: string | undefined, url: string): string {
        if (!base || ABSOLUTE.test(url)) {
            return url;
        }

        if (url === '') {
            return base;
        }

        return `${base.replace(/\/+$/, '')}/${url.replace(/^\/+/, '')}`;
    }
}
