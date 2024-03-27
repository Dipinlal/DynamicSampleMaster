import axios from "axios"
import { BASE_URL } from "../config"

const api = axios.create({
  baseURL: BASE_URL, // This sets the base URL for all requests made using this instance.
  headers: {
    "Content-Type": "application/json",
  },
});
// Function to refresh the access token
const refreshToken = async () => {
  try {
    const refreshTokenValue = localStorage.getItem("refreshToken");
    const payload = { refershToken: refreshTokenValue };
    const response = await axios.get(`${BASE_URL}/Security/RegenerateTokens`, {
      params: payload,
    });

    const { accessToken, refreshToken } = response?.data;

    // Update the local storage with the new tokens
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);

    return accessToken;
  } catch (error) {
    console.error("Failed to refresh token", error);

    // Clear tokens from local storage in case of an error
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");

    throw error;
  }
};  

// Interceptor for API requests
api.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem("accessToken");
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// Interceptor for API responses
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  async (error) => {console.log(error);
    if (error.response && error.response.status === 401) {
      try {
        // Try to refresh the token
        const newAccessToken = await refreshToken();
        // Retry the original request with the new access token
        error.config.headers.Authorization = `Bearer ${newAccessToken}`;
        return axios.request(error.config);
      } catch (refreshError) {
        console.error("Failed to refresh token", refreshError);
      }
    }
    return Promise.reject(error);
  }
);

const makeAuthorizedRequest = async (method, url, params) => {
  try {
    let response;
    const token = `${localStorage.getItem("accessToken")}`;
    const headers = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`, // Make sure spaces are correctly placed.
    };
  

    // Use the full URL with `BASE_URL` if needed. However, with Axios instance `api`, you might not need to.
    const fullUrl = `${BASE_URL}${url}`; // This is generally not needed when using axios.create with baseURL

    if (method === "get") {console.log("get");
      // For GET requests
      response = await api.get(url, { // If using `api`, you don't need `fullUrl`, just `url`
        headers
        
      });
    } else {console.log("post");
      // For POST requests
      response = await api.post(url, params, { // Same here, just use `url`
        headers,
      });
    }

    return response;
  } catch (error) {
    console.error(`Error in ${url}`, error);
  }
};

//Login page GetCompany
export const Login_GetCompany =async()=>{
try {
    const config = {
        headers: { "Content-Type": "application/json" },
    };
    const response = await axios.get(`${BASE_URL}/Login/GetCompany`,config)
    return response.data;
} catch (error) {
    console.error(error);
}
}
//Login page Login
export const Login_Login =async(payload)=>{
    try {
        
        const response = await axios.post(`${BASE_URL}/Login/login`,payload)
        return response;
    } catch (error) {
        throw error
    }
}
//getMasterFields
export const getFields = async (payload) => {
  const response = await axios.get(`${BASE_URL}/MasterField/GetMastersFields`)
  return response;
   // return makeAuthorizedRequest("get","/MasterField/GetMastersFields",payload);
};
export const getAutocomplete = async (formDataiType,productSearchkey) => {
  //return makeAuthorizedRequest("get",itag);
  const headers = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${localStorage.getItem("accessToken")}`, // Corrected
  };
  const response = await axios.get(`http://103.120.178.195/maxapi/MaxAccount/GetTradeProduct?iType=${formDataiType}&Search=${productSearchkey}`,headers)
  return response;
};
export const getAutocomplete1 = async (itag) => {
    //return makeAuthorizedRequest("get",itag);
    const headers = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${localStorage.getItem("accessToken")}`, // Corrected
    };
    const response = await axios.get(`${BASE_URL}${itag}`,headers)
    return response;
};


export const postEmployee = async (payload) => {
 
  const token = `${localStorage.getItem("accessToken")}`
  
  const response = await axios.post(`${BASE_URL}/Employee/UpsertEmployee`,payload,{
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    }
  })
    return response;
  //return makeAuthorizedRequest("post","/Employee/UpsertEmployee",payload);
};