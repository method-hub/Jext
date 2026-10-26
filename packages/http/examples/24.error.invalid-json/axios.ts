import axios from 'axios';
import { API } from '../api';

export default async function run(): Promise<boolean> {
    try {
        await axios.get(`${API}/broken.json`, {
            responseType: 'json',
            transitional: { silentJSONParsing: false },
        });
        return false;
    } catch (error) {
        return axios.isAxiosError(error) && error.code === 'ERR_BAD_RESPONSE';
    }
}
