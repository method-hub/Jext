import type { AfterResponse, BeforeRequest, Hooks, Outgoing } from '@Http/Contract/Hooks';
import HttpError from '@Http/Error/HttpError';

/**
 * @summary Runs the hooks of a client in order, each one with what the one before returned.
 *
 * @description A hook that throws or rejects becomes an `HttpError` with the message
 * `A beforeRequest hook failed` (status `0`, no response) or `An afterResponse hook failed` (the status and the
 * response it got), and the error of the hook as `cause`.
 */
export default class HookRunner {
    private readonly before: ReadonlyArray<BeforeRequest>;
    private readonly after: ReadonlyArray<AfterResponse>;

    constructor(hooks: Hooks = {}) {
        this.before = hooks.beforeRequest ?? [];
        this.after = hooks.afterResponse ?? [];
    }

    /**
     * @summary Hooks of both clients: the hooks of `this` first, then `hooks`.
     *
     * @param hooks - The hooks of the new client.
     * @returns The hooks to give to the new client.
     */
    public concat(hooks: Hooks = {}): Hooks {
        return {
            beforeRequest: [...this.before, ...(hooks.beforeRequest ?? [])],
            afterResponse: [...this.after, ...(hooks.afterResponse ?? [])],
        };
    }

    /**
     * @summary Passes the request through every `beforeRequest` hook and returns the last one.
     *
     * @param request - The request before the hooks.
     * @returns The request after the hooks.
     * @throws {HttpError} When a hook throws or rejects.
     */
    public async request(request: Outgoing): Promise<Outgoing> {
        let current = request;

        try {
            for (const hook of this.before) {
                current = (await hook(current)) ?? current;
            }
        } catch (cause: unknown) {
            throw new HttpError('A beforeRequest hook failed', { status: 0, response: null, data: null, cause });
        }

        return current;
    }

    /**
     * @summary Passes the response through every `afterResponse` hook and returns the last one.
     *
     * @param response - The response before the hooks.
     * @param request - The request that got the response.
     * @returns The response after the hooks.
     * @throws {HttpError} When a hook throws or rejects.
     */
    public async response(response: Response, request: Outgoing): Promise<Response> {
        let current = response;

        try {
            for (const hook of this.after) {
                current = (await hook(current, request)) ?? current;
            }
        } catch (cause: unknown) {
            const failure = { status: current.status, response: current, data: null, cause };
            throw new HttpError('An afterResponse hook failed', failure);
        }

        return current;
    }
}
