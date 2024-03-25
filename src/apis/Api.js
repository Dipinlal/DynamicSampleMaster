import axios from "axios"
import { BASE_URL } from "../config"

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
      "Content-Type": "application/json",
    },
});
const makeAuthorizedRequest = async (method, url, params) => {
    try {
      let response;
      const headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("accessToken")}`, // Corrected
      };
  
      if (method === "get") {
        response = await api.get(url, {
          headers,
          params,
        });
      } else {
        response = await api.post(url, params, {
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
export const getAutocomplete = async (itag) => {
    // return makeAuthorizedRequest("get",itag);
    const headers = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${localStorage.getItem("accessToken")}`, // Corrected
    };
    const response = await axios.get(`${BASE_URL}${itag}`,headers)
    return response;
};

export const postEmployee = async (payload) => {
  console.log(payload);
  const token = `${localStorage.getItem("accessToken")}`
  console.log(token);
  const response = await axios.post(`${BASE_URL}/Employee/UpsertEmployee`,payload,{
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    }
  })
    return response;
  //return makeAuthorizedRequest("post","/Employee/UpsertEmployee",payload);
};