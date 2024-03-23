// syncUtils.js

import axios from "axios";
import { toast } from "react-toastify";
import {
    dataSyncRequest,
    dataSyncSuccess,
    dataSyncFail,
    clearSyncError,
    clearSyncSuccess
  } from "../slices/utilsSlice"
import { BASE_URL } from "../../config";

export const syncAction = async (dispatch) => {
  dispatch(dataSyncRequest());

  try {
    const response = await axios.get(`${BASE_URL}/DataRefresh`);
    
    // Check if the response status is 200 (OK)
    if (response.status === 200) {
     
      dispatch(dataSyncSuccess());
      // Optionally, show a success message here
    } else {
      throw new Error('Network response was not ok.');
    }
  } catch (error) {
    console.error('Sync error', error);
    dispatch(dataSyncFail());
    // Optionally, show an error message here
  }
};
export const clearErrorSync = async (dispatch)=>{
  dispatch(clearSyncError());
}
export const clearSuccessSync = async (dispatch)=>{
  dispatch(clearSyncSuccess())
}


// export const syncAction = async (dispatch) => {

 
//   dispatch(dataSyncRequest());

 
//   try {
//     const response = await axios.get("/sampleurl")
  
//     if (response.status !== 200) {
//       throw new Error('Network response was not ok.');
//     }

//     dispatch(dataSyncSuccess());
//     // Optionally, show a success message here
//   } catch (error) {
//     console.error('Sync error', error);
    
//     await new Promise(resolve => setTimeout(resolve, 10000)); 
  
//       dispatch(dataSyncFail(error.message));
//       dispatch(clearSyncError());
//       return { success: false, error: error.message };
   
//   }
// };
