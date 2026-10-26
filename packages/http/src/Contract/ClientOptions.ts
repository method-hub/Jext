import type { DeliveryOptions } from '@Http/Contract/DeliveryOptions';
import type { Hooks } from '@Http/Contract/Hooks';

/**
 * @summary Settings shared by every request of a client created with `http.extend()`.
 */
export interface ClientOptions extends DeliveryOptions {
    /** Prefixed to every relative URL: `baseUrl: 'https://api.example.com/v2'` + `'/users'`. */
    baseUrl?: string;
    /** Sent with every request; a header set on the request replaces the same header here. */
    headers?: HeadersInit;
    /** Called around every request; `extend()` adds them after the hooks of the client it extends. */
    hooks?: Hooks;
}
