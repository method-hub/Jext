import type { DeliveryOptions } from '@Http/Contract/DeliveryOptions';
import type { ProgressOptions } from '@Http/Contract/Progress';
import type { Transport } from '@Http/Contract/Transport';
import RetryPolicy from '@Http/Delivery/RetryPolicy';
import FetchTransport from '@Http/Transport/FetchTransport';
import XhrTransport from '@Http/Transport/XhrTransport';

/**
 * @summary The state of one attempt: the policy of the request, the timeout and the number of the attempt.
 */
interface Attempt {
    /** Sends the attempt: `fetch` or `XMLHttpRequest`. */
    transport: Transport;
    /** Decides whether a failed attempt is repeated. */
    policy: RetryPolicy;
    /** The time one attempt may take in ms; `0` means no limit. */
    timeout: number;
    /** The number of the attempt, from 1. */
    number: number;
}

/**
 * @summary Sends each attempt through a transport with a timeout and repeats failed attempts by the retry policy.
 *
 * @description The transport is `fetch`, or `XMLHttpRequest` when the request has an upload listener (and XHR
 * exists, so not in Node) and is not a `Request` object. Every attempt reports its progress from zero. Resolves
 * with the last `Response`, whatever its status, and rejects with the last error when no attempt got a response.
 * The caller's `signal` cancels the current attempt and the wait between attempts.
 */
export default class Delivery {
    /**
     * @summary Sends the request, repeating it while the retry policy allows.
     *
     * @param url - The resource URL or a `Request`.
     * @param init - The settings of the request; its signal cancels the attempts and the waits.
     * @param options - The timeout, the retries and the progress listeners.
     * @returns The response of the last attempt.
     */
    public static send(
        url: string | Request,
        init: RequestInit,
        options: DeliveryOptions & ProgressOptions
    ): Promise<Response> {
        const method = init.method ?? (url instanceof Request ? url.method : 'GET');
        const policy = new RetryPolicy(options.retry, method);
        const transport = Delivery.transport(url, options);

        return Delivery.attempt(url, init, { transport, policy, timeout: options.timeout ?? 0, number: 1 });
    }

    /**
     * @summary Picks the transport: XHR for a request with an upload listener when XHR exists, `fetch` otherwise.
     *
     * @param url - The resource URL or a `Request`.
     * @param options - The progress listeners.
     * @returns The transport for every attempt of the request.
     */
    private static transport(url: string | Request, options: ProgressOptions): Transport {
        const { onUploadProgress, onDownloadProgress } = options;
        const xhr = typeof XMLHttpRequest === 'function' && !(url instanceof Request);

        return onUploadProgress && xhr
            ? new XhrTransport(onUploadProgress, onDownloadProgress ?? null)
            : new FetchTransport(onDownloadProgress ?? null);
    }

    /**
     * @summary Sends one attempt and, when the policy allows, waits and sends the next one.
     *
     * @param url - The resource URL or a `Request`.
     * @param init - The settings of the request.
     * @param state - The transport, the policy, the timeout and the number of this attempt.
     * @returns The response of the last attempt.
     */
    private static async attempt(url: string | Request, init: RequestInit, state: Attempt): Promise<Response> {
        const { transport, policy, timeout, number } = state;
        let response: Response;

        try {
            response = await transport.send(
                url,
                timeout > 0 ? { ...init, signal: Delivery.signal(init.signal ?? null, timeout) } : init
            );
        } catch (error: unknown) {
            if (!policy.recovers(number, error)) {
                throw error;
            }

            await Delivery.sleep(policy.wait(number, null), init.signal ?? null);
            return Delivery.attempt(url, init, { ...state, number: number + 1 });
        }

        if (!policy.retries(number, response)) {
            return response;
        }

        await response.body?.cancel();
        await Delivery.sleep(policy.wait(number, response), init.signal ?? null);
        return Delivery.attempt(url, init, { ...state, number: number + 1 });
    }

    /**
     * @summary Joins the caller's signal with a timer that aborts the attempt after `timeout` ms.
     *
     * @param signal - The caller's signal, `null` when there is none.
     * @param timeout - The time one attempt may take in ms.
     * @returns The signal of the attempt.
     */
    private static signal(signal: AbortSignal | null, timeout: number): AbortSignal {
        const timer = AbortSignal.timeout(timeout);

        return signal ? AbortSignal.any([signal, timer]) : timer;
    }

    /**
     * @summary Waits between attempts; the caller's signal ends the wait with its reason.
     *
     * @param ms - The wait in ms.
     * @param signal - The caller's signal, `null` when there is none.
     * @returns A promise that resolves after the wait.
     */
    private static sleep(ms: number, signal: AbortSignal | null): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            if (signal?.aborted) {
                reject(Delivery.reason(signal));
                return;
            }

            const abort = (): void => {
                clearTimeout(timer);
                reject(Delivery.reason(signal));
            };
            const timer = setTimeout(() => {
                signal?.removeEventListener('abort', abort);
                resolve();
            }, ms);

            signal?.addEventListener('abort', abort, { once: true });
        });
    }

    /**
     * @summary The error an aborted wait rejects with: the reason of the signal, or an `AbortError`.
     *
     * @param signal - The aborted signal.
     * @returns The error.
     */
    private static reason(signal: AbortSignal | null): Error {
        const reason: unknown = signal?.reason;

        // Not instanceof Error: a reason made by AbortSignal.timeout() may come from another realm
        return typeof reason === 'object' && reason !== null
            ? (reason as Error)
            : new DOMException('The operation was aborted', 'AbortError');
    }
}
