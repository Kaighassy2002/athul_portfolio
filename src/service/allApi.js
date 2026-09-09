import { commonAPI, unwrapBody } from "./commonAPI"
import { SERVER_URL } from "./serverURL"

export function unwrapList(response) {
  const payload = response?.data;
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.blogs)) return payload.blogs;
  if (Array.isArray(payload?.scribbles)) return payload.scribbles;
  return [];
}

async function fetchPagedList(path) {
  const limit = 50;
  const all = [];
  let page = 1;
  let total = Infinity;
  let lastResponse = null;

  while (all.length < total && page <= 20) {
    const response = await commonAPI(
      "GET",
      `${SERVER_URL}${path}?page=${page}&limit=${limit}`
    );
    lastResponse = response;
    if (response?.status !== 200) {
      return page === 1 ? response : { status: 200, data: { data: all, total: all.length } };
    }
    const chunk = unwrapList(response);
    const payload = response?.data || {};
    total = Number.isFinite(Number(payload.total)) ? Number(payload.total) : all.length + chunk.length;
    all.push(...chunk);
    if (!chunk.length || chunk.length < limit) break;
    page += 1;
  }

  return {
    status: lastResponse?.status || 200,
    data: { success: true, data: all, total: all.length },
  };
}

export const getAllcertificatesAPI = async()=>{
    return await commonAPI('GET',`${SERVER_URL}/getAllcertificates`);
}


export const listAllBlogsAPI= async()=>{
  return fetchPagedList("/list-blog");
}

export const blogByIdAPI = async (id) => {
  return await commonAPI("GET", `${SERVER_URL}/blog/${id}`);
};

export const scribbleByIdAPI = async (id) => {
  return await commonAPI("GET", `${SERVER_URL}/scribble/${id}`);
};

export const listAllScribblesAPI= async()=>{
  return fetchPagedList("/list-scribble");
}


export const getTeckStackAPI= async()=>{
  return  await commonAPI("GET",`${SERVER_URL}/tech-items`)
}

export const getProjectAPI= async()=>{
  return  await commonAPI("GET",`${SERVER_URL}/getprojects`)
}

export const authConfigAPI = async () =>
  unwrapBody(await commonAPI("GET", `${SERVER_URL}/auth/config`));

export const signupAPI = async (body) =>
  unwrapBody(await commonAPI("POST", `${SERVER_URL}/auth/signup`, body));

export const loginAPI = async (body) =>
  unwrapBody(await commonAPI("POST", `${SERVER_URL}/auth/login`, body));

export const googleLoginAPI = async (body) =>
  unwrapBody(await commonAPI("POST", `${SERVER_URL}/auth/google`, body));

export const forgotPasswordAPI = async (body) =>
  unwrapBody(await commonAPI("POST", `${SERVER_URL}/auth/forgot`, body));

export const resetPasswordAPI = async (body) =>
  unwrapBody(await commonAPI("POST", `${SERVER_URL}/auth/reset`, body));

export const verifyEmailAPI = async (body) =>
  unwrapBody(await commonAPI("POST", `${SERVER_URL}/auth/verify`, body));

export const resendVerificationAPI = async (body) =>
  unwrapBody(await commonAPI("POST", `${SERVER_URL}/auth/resend-verification`, body));

export const refreshSessionAPI = async () =>
  unwrapBody(await commonAPI("POST", `${SERVER_URL}/auth/refresh`, {}));

export const logoutAPI = async () =>
  unwrapBody(await commonAPI("POST", `${SERVER_URL}/auth/logout`, {}));

export const contactAPI = async (body) =>
  unwrapBody(await commonAPI("POST", `${SERVER_URL}/contact`, body));

export const meAPI = async () =>
  unwrapBody(await commonAPI("GET", `${SERVER_URL}/auth/me`));

export const blogEngagementAPI = async (id) =>
  unwrapBody(await commonAPI("GET", `${SERVER_URL}/blog/${id}/engagement`));

export const toggleBlogLikeAPI = async (id) =>
  unwrapBody(await commonAPI("POST", `${SERVER_URL}/blog/${id}/like`, {}));

export const addBlogCommentAPI = async (id, body) =>
  unwrapBody(await commonAPI("POST", `${SERVER_URL}/blog/${id}/comments`, body));

export const deleteBlogCommentAPI = async (id) =>
  unwrapBody(await commonAPI("DELETE", `${SERVER_URL}/blog-comments/${id}`));

export const recordBlogViewAPI = async (id) =>
  unwrapBody(await commonAPI("POST", `${SERVER_URL}/blog/${id}/view`, {}));

export const recordBlogShareAPI = async (id) =>
  unwrapBody(await commonAPI("POST", `${SERVER_URL}/blog/${id}/share`, {}));
