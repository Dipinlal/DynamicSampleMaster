import { createSlice } from "@reduxjs/toolkit";


const authSlice = createSlice({
    name:'auth',
    initialState:{
        
         loading: false,
         userExists:null,
         sUserName:null,
         iId:null,
         
         
    },
    reducers:{
        loginRequest(state,action){
            return{
                
                loading: true
            }
        },
        loginSuccess(state,action){
            return{
                ...state,
                loading:false,
                userExists:action.payload.UserExists,
                iId:action.payload.iId,
                sUserName:action.payload.sUserName,
                

                
            }
        },
        loginFail(state,action){
            return {
                ...state,
                loading: false,
                error:action.payload
            }
        },
        loginErrorClear(state,action){
            return {
                
                loading: false,
                error:null
            }
        },
        logoutRequest(state,action){
            return {
                ...state,
                loading: true,
                logoutDelay:true,
                
                
            }
        },
        logoutSuccess(state, action){
            return {
                loading: false,
                userExists: null,
                error: null,
                iId:null,
                sUserName:null,
                expiryTime:null,
                logoutDelay:true,
                
                
            }
        },
        logoutDelayClear(state, action){
            return {
                ...state,
                logoutDelay:false,
                
                
            }
        },
        logoutFail(state, action){
            return {
                ...state,
                error: action.payload,
                loading:false,
                logoutDelay:false,
            }
        },
        clearError(state, action) {
            return {
              ...state,
              error: null,
              userExists:null,
              iId:null,
              sUserName:null,
              expiryTime:null
            };
        },

    }
    
});

const {actions,reducer }= authSlice;

export const {
    loginRequest,loginSuccess,loginFail,
    logoutRequest,logoutSuccess,logoutFail,
    clearError,logoutDelayClear,loginErrorClear
    

   
    }= actions;

export default reducer;