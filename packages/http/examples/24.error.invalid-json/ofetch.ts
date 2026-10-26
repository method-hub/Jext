import { ofetch } from 'ofetch';
import { API } from '../api';

export default async function run(): Promise<boolean> {
    try {
        await ofetch(`${API}/broken.json`, { parseResponse: JSON.parse });
        return false;
    } catch (error) {
        return (error as Error).name === 'SyntaxError';
    }
}
