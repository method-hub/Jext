import { http } from '@metapraxis/jext-http';
import { API } from '../api';

export default async function run(): Promise<boolean> {
    const { error } = await http.get(`${API}/slow`).timeout(200);

    return (error?.cause as Error | undefined)?.name === 'TimeoutError';
}
