import type { Decoding } from '@Http/Contract/Decoding';
import type { DeliveryOptions } from '@Http/Contract/DeliveryOptions';
import type { ProgressOptions } from '@Http/Contract/Progress';

/**
 * @summary The third argument of `send()`: how the response is decoded, how the request travels and who hears its
 * progress.
 */
export interface SendOptions extends Decoding, DeliveryOptions, ProgressOptions {}
