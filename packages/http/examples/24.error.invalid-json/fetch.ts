import { API } from '../api';

export default async function run(): Promise<boolean> {
    const response = await fetch(`${API}/broken.json`);

    try {
        await response.json();
        return false;
    } catch (error) {
        return (error as Error).name === 'SyntaxError';
    }
}
