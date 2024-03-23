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
    return makeAuthorizedRequest("get","/MasterField/GetMastersFields",payload);
};
export const getAutocomplete = async (itag,payload) => {
    return makeAuthorizedRequest("get",itag,payload);
};