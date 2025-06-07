import { commonAPI } from "./commonAPI"
import { SERVER_URL } from "./serverURL"


export const getAllcertificatesAPI = async()=>{
    return await commonAPI('GET',`${SERVER_URL}/getAllcertificates`);
}


export const listAllBlogsAPI= async()=>{
  return  await commonAPI("GET",`${SERVER_URL}/list`)
}

export const blogByIdAPI = async (id) => {
  return await commonAPI("GET", `${SERVER_URL}/blog/${id}`);
};