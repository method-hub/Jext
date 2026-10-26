import { http } from '@metapraxis/jext-http';
import { API } from '../api';

export default async function run(): Promise<boolean> {
    const { error } = await http.get(`${API}/broken.json`);

    return (error?.cause as Error | undefined)?.name === 'SyntaxError';
}
