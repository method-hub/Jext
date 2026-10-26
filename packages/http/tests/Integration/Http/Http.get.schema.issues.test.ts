import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { createServer, type Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import { join } from 'node:path';
import Bootstrap from '@Http/Bootstrap';
import ValidationError from '@Http/Error/ValidationError';
import type { StandardSchema } from '@Http/Contract/StandardSchema';

const body = readFileSync(join(__dirname, '..', '__fixtures__', 'data.json'));

const Admin: StandardSchema<unknown, { role: 'admin' }> = {
    '~standard': {
        version: 1,
        vendor: 'test',
        validate: (value) =>
            (value as { role?: unknown }).role === 'admin'
                ? { value: { role: 'admin' } }
                : { issues: [{ message: 'Expected "admin"', path: ['role'] }] },
    },
};

describe('Http.get should return a ValidationError for data from a local server', () => {
    let server: Server;
    let url: string;

    beforeAll(async () => {
        server = createServer((_request, response) => {
            response.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' }).end(body);
        });

        await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
        url = `http://127.0.0.1:${(server.address() as AddressInfo).port}/users/1`;
    });

    afterAll(async () => {
        server.closeAllConnections();
        await new Promise((resolve) => server.close(resolve));
    });

    it('when the decoded JSON does not match the schema', async () => {
        const http = new Bootstrap().init();

        const { data, error } = await http.get<unknown>(url).as('json').schema(Admin);

        expect(data).toBeNull();
        expect(error).toBeInstanceOf(ValidationError);
        expect(error?.message).toBe('role: Expected "admin"');
        expect(error?.status).toBe(200);
    });
});
