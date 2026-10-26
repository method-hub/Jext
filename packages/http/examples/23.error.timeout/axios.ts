import axios from 'axios';
import { API } from '../api';

export default async function run(): Promise<boolean> {
    try {
        await axios.get(`${API}/slow`, { timeout: 200 });
        return false;
    } catch (error) {
        return axios.isAxiosError(error) && error.code === 'ECONNABORTED';
    }
}
