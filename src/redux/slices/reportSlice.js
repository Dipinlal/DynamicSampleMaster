import { createSlice } from "@reduxjs/toolkit";


const reportSlice = createSlice({
    name:'report',
    initialState:{
        
         loading: false,
         responseTable:null
         
         
    },
    reducers:{
        reportRequest(state,action){
            return{
                ...state,
                loading:true
               
            }
        },
        reportSuccess(state,action){
            return{
                ...state,
               responseTable:action.payload

                
            }
        },
        reportFail(state,action){
            return {
                ...state,
                error:action.payload
            }
        },
                clearReportError(state, action) {
            return {
              ...state,
              error: null,
              
            };
        },

    }
    
});

const {actions,reducer }= reportSlice;

export const {
   reportRequest,reportSuccess,reportFail

   
    }= actions;

export default reducer;