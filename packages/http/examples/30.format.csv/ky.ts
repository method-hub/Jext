import ky, { HTTPError } from 'ky';
import { API } from '../api';

// A small CSV reader: quoted cells may hold commas and doubled quotes, but not line breaks
function parseCsv(text: string): string[][] {
    const cell = /(?:^|,)(?:"(?<quoted>(?:[^"]|"")*)"|(?<plain>[^,]*))/gu;

    return text
        .trim()
        .split('\n')
        .map((line) =>
            [...line.matchAll(cell)].map(({ groups }) => groups?.quoted?.replace(/""/gu, '"') ?? groups?.plain ?? '')
        );
}

export default async function run(): Promise<string[][]> {
    try {
        return parseCsv(await ky.get(`${API}/report.csv`).text());
    } catch (error) {
        // An error status: ky throws HTTPError with the response
        if (error instanceof HTTPError) {
            throw new Error(`${error.response.status} ${error.response.statusText}`);
        }

        throw error; // no response: the network, a timeout
    }
}
