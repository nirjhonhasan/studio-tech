import { authClient } from "./auth-client"


export const ClientTokenForServer = async () =>{
    const {data} = await authClient.token();
    const token = data?.token;

    return token;
}