import { createSlice } from "@reduxjs/toolkit";


const masterSlice = createSlice({
    name:'master',
    initialState:{
        
         
         account:false,
         icp:false,
         product:false,
         otherMaster:[]
         
         
    },
    reducers:{
        MasterScreenSuccess(state,action){
           
            return{
                ...state,
               account:action.payload.account,
               icp:action.payload.icp,
               product:action.payload.product,
               otherMaster:action.payload.otherMaster


               
            }
        },
        MasterScreenClear(state,action){
           
            return{
                ...state,
                account:false,
                icp:false,
                product:false,
                otherMaster:[]


               
            }
        },
        

    }
    
});

const {actions,reducer }= masterSlice;

export const {
    MasterScreenSuccess,MasterScreenClear

   
    }= actions;

export default reducer;