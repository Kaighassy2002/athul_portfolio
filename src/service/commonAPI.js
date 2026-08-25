import axios from "axios";

const TOKEN_KEY = "aqc-token";

export function getAuthToken() {
  try {
    return localStorage.getItem(TOKEN_KEY) || "";
  } catch {
    return "";
  }
}

export function setAuthToken(token) {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* private mode */
  }
}

export const commonAPI = async (httpRequest, url, reqBody, reqHeader) => {
  const token = getAuthToken();
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(reqHeader || {}),
  };

  const reqConfig = {
    method: httpRequest,
    url,
    data: reqBody,
    headers,
  };

  return await axios(reqConfig)
    .then((res) => res)
    .catch((err) => err);
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
