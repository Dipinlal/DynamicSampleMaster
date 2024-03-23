import {
    loginFail, loginRequest,loginSuccess, 
    logoutRequest,logoutSuccess,logoutFail,
    clearError,logoutDelayClear,loginErrorClear
    
} from '../slices/authSlice';
import axios from 'axios';


export const login = (name, password) => async (dispatch) => {
   
          

            try {
                dispatch(loginRequest())

               

                const config = {
                    headers: {
                        'Content-Type': 'application/json',
                        
                      }

                }
               
                
                const response  = await axios.get(`${BASE_URL}/UserLogin?sLoginName=${name}&sPassword=${password}`,config);
                
                const responseTables = JSON.parse(response.data.ResultData);          
                const currentTime = new Date().getTime();
                const expirationTime = currentTime +idleTime;
                localStorage.setItem("timeStamp", expirationTime);
                dispatch(loginSuccess(responseTables[0]))
               
                const iId = responseTables[0].iId
                
                const masterData = await processMasterScreenData(iId);
            
                dispatch(MasterScreenSuccess(masterData))
                return { success: true};
            } catch (error) {
                console.log(error)
                if(error.message){
                    dispatch(loginFail(error.message))
                }
                else{
                    dispatch(loginFail(error))
                }
                
                
            }
    
}
