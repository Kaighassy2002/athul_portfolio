import axios from "axios";

const client = axios.create({
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

let refreshPromise = null;

client.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    const status = error?.response?.status;
    const url = String(original?.url || "");
    const skip =
      url.includes("/auth/login") ||
      url.includes("/auth/signup") ||
      url.includes("/auth/refresh") ||
      url.includes("/auth/logout") ||
      original?._retry;

    if (status === 401 && original && !skip) {
      original._retry = true;
      try {
        if (!refreshPromise) {
          refreshPromise = client.post("/api/auth/refresh", {}).finally(() => {
            refreshPromise = null;
          });
        }
        await refreshPromise;
        return client(original);
      } catch {
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);

export const commonAPI = async (httpRequest, url, reqBody, reqHeader) => {
  const reqConfig = {
    method: httpRequest,
    url,
    data: reqBody,
    headers: reqHeader || undefined,
  };

  try {
    return await client(reqConfig);
  } catch (err) {
    return err;
  }
};

export function unwrapBody(response) {
  if (response?.status >= 200 && response?.status < 300) {
    return { ok: true, status: response.status, data: response.data || {} };
  }

  const status = response?.response?.status || 0;
  const data = response?.response?.data || {};
  return {
    ok: false,
    status,
    data,
    message: data.message || "The request did not go through.",
    code: data.code || "",
  };
}
