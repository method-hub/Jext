import axios from 'axios';
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
        const { data } = await axios.get<string>(`${API}/report.csv`, { responseType: 'text' });

        return parseCsv(data);
    } catch (error) {
        // An error status: the AxiosError carries the response
        if (axios.isAxiosError(error) && error.response) {
            throw new Error(`${error.response.status} ${error.response.statusText}`);
        }

        throw error; // no response: the network, a timeout
    }
}
