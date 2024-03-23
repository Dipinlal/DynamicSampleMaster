import { createSlice } from "@reduxjs/toolkit";


const utilsSlice = createSlice({
    name:'utils',
    initialState:{
        isSyncing:false,
        syncError:null,
        syncSuccess:false
         
    },
    reducers:{
        dataSyncRequest(state,action){
            return{
                ...state,
                isSyncing:true,
                syncError:null,
                syncSuccess:false
            }
        },
        dataSyncSuccess(state,action){
            return{
                ...state,
                isSyncing:false,
                syncError:null,
                syncSuccess:true

                
            }
        },
        dataSyncFail(state,action){
            return {
                ...state,
                isSyncing:false,
                syncError:'Sync Failed',
                syncSuccess:false
            }
        },
        
        clearSyncError(state, action) {
            return {
              ...state,
              syncError:null,
              syncSuccess:false,
              isSyncing:false,
            };
        }, 
        clearSyncSuccess(state, action) {
            return {
              ...state,
              syncError:null,
              syncSuccess:false,
              isSyncing:false,
            };
        },

    }
    
});

const {actions,reducer }= utilsSlice;

export const {
    dataSyncRequest,dataSyncSuccess,dataSyncFail,
    clearSyncError,clearSyncSuccess
    

   
    }= actions;

export default reducer;