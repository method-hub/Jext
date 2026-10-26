import { describe, expect, it } from 'vitest';
import SseParser from '@Http/Parsers/SseParser';
import type { ServerEvent } from '@Http/Contract/ServerEvent';

describe('SseParser.wrap should pass a stream error to the reader', () => {
    it('when the stream fails after the first event', async () => {
        const encoder = new TextEncoder();
        let sent = false;
        const body = new ReadableStream<Uint8Array>({
            pull(controller) {
                if (sent) {
                    controller.error(new Error('connection lost'));
                    return;
                }

                sent = true;
                controller.enqueue(encoder.encode('data: first\n\n'));
            },
        });
        const parser = new SseParser();
        const received: ServerEvent[] = [];

        const reading = (async () => {
            for await (const event of await parser.wrap(new Response(body))) {
                received.push(event);
            }
        })();

        await expect(reading).rejects.toThrow('connection lost');
        expect(received.map(({ data }) => data)).toEqual(['first']);
    });
});
