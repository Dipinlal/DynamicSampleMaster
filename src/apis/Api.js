import axios from "axios";
import { BASE_URL } from "../config.js";
import api from "../axios.js";

let isRefreshing = false;
let failedQueue = [];

// const processQueue = (error, token = null) => {
//   failedQueue.forEach(prom => {
//     if (error) {
//       prom.reject(error);
//     } else {
//       prom.resolve(token);
//     }
//   });

//   failedQueue = [];
// };

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};
const addRequestToQueue = (originalRequest) => {
  return new Promise((resolve, reject) => {
    failedQueue.push({
      resolve: (token) => {
        originalRequest.headers['Authorization'] = 'Bearer ' + token;
        resolve(api(originalRequest));
      },
      reject: (err) => {
        reject(err);
      }
    });
  });
};




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
    console.error("refresh token error", error);

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
// api.interceptors.response.use(
//   (response) => {
//     return response.data;
//   },
//   async (error) => {
//     if (error.response && error.response.status === 401) {
//       try {
//         // Try to refresh the token
//         const newAccessToken = await refreshToken();
        
//         // Retry the original request with the new access token
//         error.config.headers.Authorization = `Bearer ${newAccessToken}`;
//         return axios.request(error.config);
//       } catch (refreshError) {
//         console.error("Failed to refresh token from interceptor", refreshError);
//         window.location.href = '/';
//       }
//     }
//     return Promise.reject(error);
//   }
// );

// api.interceptors.response.use(
//   (response) => {
//     return response.data;
//   },
//   async (error) => {
//     const originalRequest = error.config;

//     if (error.response && error.response.status === 401) {
//       if (!isRefreshing) {
//         isRefreshing = true;
//         refreshToken().then(newToken => {
//           isRefreshing = false;
//           localStorage.setItem('accessToken', newToken);
//           processQueue(null, newToken);

//           originalRequest.headers['Authorization'] = 'Bearer ' + newToken;
//           return api(originalRequest);
//         }).catch(refreshError => {
//           processQueue(refreshError, null);
//           console.error("Failed to refresh token from interceptor", refreshError);
//           window.location.href = '/';
//         });
//       }

//       return new Promise((resolve, reject) => {
//         failedQueue.push({ resolve, reject });
//       }).then(token => {
//         originalRequest.headers['Authorization'] = 'Bearer ' + token;
//         return api(originalRequest);
//       }).catch(err => {
//         return Promise.reject(err);
//       });
//     }

//     return Promise.reject(error);
//   }
// );

api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const newToken = await refreshToken();
          isRefreshing = false;
          api.defaults.headers.common['Authorization'] = 'Bearer ' + newToken;
          processQueue(null, newToken);
          originalRequest._retry = true;
          originalRequest.headers['Authorization'] = 'Bearer ' + newToken;
          return api(originalRequest);
        } catch (refreshError) {console.log(refreshError,"refreshError");
          processQueue(refreshError, null);
          window.location.href = '/';
          return Promise.reject(refreshError);
        }
      }
      else {
        return addRequestToQueue(originalRequest).catch(err => {
          return Promise.reject(err);
        });
      } 
      // If a refresh is already in progress, we'll return a promise that resolves with the new token
      return new Promise((resolve, reject) => {
        failedQueue.push((token) => {
          originalRequest._retry = true;
          originalRequest.headers['Authorization'] = 'Bearer ' + token;
          resolve(api(originalRequest));
        });
      });
    }
    return Promise.reject(error);
  }
);


// const makeAuthorizedRequest = async (method,url, params) => {
  
//   const token = `${localStorage.getItem("accessToken")}`
//   try {
//     let response 
//     if(method === "get"){
//       response= await api.get(url, {
//         headers: {
//           "Content-Type": "application/json",
//           "Authorization": `Bearer ${token}`,
//         },
//         params,
//       });
//     }else{
//       response= await api.post(url,params, {
//         headers: {
         
//           "Authorization": `Bearer ${token}`
//         },
//       });
//     }
  
//     return response;
//   } catch (error) {
//     console.error(`Error in ${url}`, error);
//   }
// };

//Login page GetCompany

const makeAuthorizedRequest = async (method, url, params) => {
  const token = localStorage.getItem("accessToken");
  const headers = {
    "Authorization": `Bearer ${token}`
  };

  // When dealing with FormData, let Axios handle the Content-Type
  if (params instanceof FormData) {
    
    headers['Content-Type'] = "multipart/form-data"; // This ensures Axios sets the correct type
  } else {
    headers['Content-Type'] = "application/json";
  }

  try {
    let response;
    if(method === "get"){
            response= await api.get(url,{ headers, params });
    }
    else{        
     response = await api({
      method: method,
      url: url,
      data: params,
      headers: headers
    });
   }

    return response;
  } catch (error) {
    console.error(`Error in ${url}`, error);
    throw error;
  }
};



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
// export const UploadFiles = async ({masterId,formData}) => {
 

//  return makeAuthorizedRequest("post", `/Employee/UploadFiles?masterId=${masterId}`, formData);

//   // const token = `${localStorage.getItem("accessToken")}`
//   // const response = await axios.post(`${BASE_URL}/Employee/UploadFiles?masterId=${masterId}`, formData, {
//   //   headers: {
//   //     // "Content-Type": "multipart/form-data",
//   //     "Authorization": `Bearer ${token}`,
//   //   },
//   // });
//   // return response;
// };

export const UploadFiles = async ({ masterId, formData }) => {
  // Ensure formData is correctly populated with file data
  return makeAuthorizedRequest("post", `/Employee/UploadFiles?masterId=${masterId}`, formData);
};

export const postEmployee = async (payload) => {
 
  // const token = `${localStorage.getItem("accessToken")}`
  
  // const response = await axios.post(`${BASE_URL}/Employee/UpsertEmployeesDetails`,payload,{
  //   headers: {
  //     "Content-Type": "application/json",
  //     "Authorization": `Bearer ${token}`
  //   }
  // })
  //   return response;
  return makeAuthorizedRequest("post","/Employee/UpsertEmployeesDetails",payload);
};

export const getEmployeeSummary = async (payload) => {
  return makeAuthorizedRequest("get","/Employee/GetEmployeesSummary",payload);
};

export const GetEmployeesDetails = async (payload) => {
  return makeAuthorizedRequest("get","/Employee/GetEmployeesDetails",payload);
};
