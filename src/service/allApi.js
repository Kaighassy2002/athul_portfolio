import { commonAPI } from "./commonAPI"
import { SERVER_URL } from "./serverURL"


export const getAllcertificatesAPI = async()=>{
    return await commonAPI('GET',`${SERVER_URL}/getAllcertificates`);
}