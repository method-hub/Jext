import ky, { isTimeoutError } from 'ky';
import { API } from '../api';

export default async function run(): Promise<boolean> {
    try {
        await ky.get(`${API}/slow`, { timeout: 200, retry: 0 });
        return false;
    } catch (error) {
        return isTimeoutError(error);
    }
}
