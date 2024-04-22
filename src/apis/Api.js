import axios from "axios";
import { BASE_URL } from "../config.js";
import api from "../axios.js";






// Function to refresh the access token
// Function to refresh the access token
const refreshToken = async () => {
  try {
    const refreshTokenValue = localStorage.getItem("refreshToken");
    
    
    const payload = { refershToken: refreshTokenValue };
    const response = await axios.get(`${BASE_URL}/Security/RegenerateTokens?refershToken=${refreshTokenValue}`);

    const { accessToken, refreshToken } = response?.data;

    // Update the local storage with the new tokens
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);

    return accessToken;
  } catch (error) {
    console.error("Failed to refresh token", error);

    // Clear tokens from local storage in case of an error
    // localStorage.removeItem("accessToken");
    // localStorage.removeItem("refreshToken");

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
  async (error) => {
    if (error.response && error.response.status === 401) {
      try {
        // Try to refresh the token
        const newAccessToken = await refreshToken();
        
        // Retry the original request with the new access token
        error.config.headers.Authorization = `Bearer ${newAccessToken}`;
        return axios.request(error.config);
      } catch (refreshError) {
        console.error("Failed to refresh token", refreshError);
        window.location.href = '/';
      }
    }
    return Promise.reject(error);
  }
);

const makeAuthorizedRequest = async (method,url, params) => {console.log(method,url, params);
  
  if(url=="/Employee/UploadFiles?masterId=0"){for (let [key, value] of params.entries()) {
            console.log(key, value);
          }
  }
  try {
    let response 
    if(method === "get"){
      response= await api.get(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        params,
      });
    }else{
      response= await api.post(url,params, {
        headers: {
          // "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
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
export const getFields = async (master) => {
  // const response = await axios.get(`${BASE_URL}/MasterField/GetMastersFields`)
  // return response;
  return makeAuthorizedRequest("get","/MasterField/GetMastersFields?master=Customer");
};
export const getAutocomplete = async (formDataiType,productSearchkey) => {
  return makeAuthorizedRequest("get",itag);
  // const headers = {
  //   "Content-Type": "application/json",
  //   "Authorization": `Bearer ${localStorage.getItem("accessToken")}`, // Corrected
  // };
  // const response = await axios.get(`http://103.120.178.195/maxapi/MaxAccount/GetTradeProduct?iType=${formDataiType}&Search=${productSearchkey}`,headers)
  // return response;
};
export const getAutocomplete1 = async (itag,params) => {

 
    return makeAuthorizedRequest("get",itag,params);
    // const headers = {
    //   "Content-Type": "application/json",
    //   "Authorization": `Bearer ${localStorage.getItem("accessToken")}`, // Corrected
    // };
    // const response = await axios.get(`${BASE_URL}${itag}`,headers)
    // return response;
};
export const UploadFiles = async ({masterId,formData}) => {
  return makeAuthorizedRequest("post",`/Employee/UploadFiles?masterId=${masterId}`,formData);
};


export const postEmployee = async (payload) => {
 
  const token = `${localStorage.getItem("accessToken")}`
  
  const response = await axios.post(`${BASE_URL}/Employee/UpsertEmployeesDetails`,payload,{
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    }
  })
    return response;
  //return makeAuthorizedRequest("post","/Employee/UpsertEmployee",payload);
};

export const getEmployeeSummary = async () => {
  return makeAuthorizedRequest("get","/Employee/GetEmployees");
};

