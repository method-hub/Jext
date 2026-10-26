import ky from 'ky';
import { API } from '../api';

export default async function run(): Promise<boolean> {
    try {
        await ky.get(`${API}/broken.json`).json();
        return false;
    } catch (error) {
        return (error as Error).name === 'SyntaxError';
    }
}
