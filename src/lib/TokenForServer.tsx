import { auth } from './auth';
import { headers } from 'next/headers';

export const TokenForServer = async () => {
    const jwtToken = await auth.api.getToken({
        headers: await headers()
    })
    const token = jwtToken?.token;

    return token
};
