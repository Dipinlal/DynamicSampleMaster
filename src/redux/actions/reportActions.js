import axios from 'axios';
import {
    reportRequest,reportSuccess,reportFail
    
} from '../slices/reportSlice';

export const getReportDetails = (url,formData) => async (dispatch) => {

    try {

        try {
           dispatch(reportRequest())

            const config = {
              headers: {
                "Content-type": "application/json",
              },
            };

            const response = await axios.post(url, formData, config);

            const responseTable = JSON.parse(response.data.ResultData);
            
            
            dispatch(reportSuccess(responseTable))
          } catch (error) {
            console.log(error);

            dispatch(reportFail(error))
         
           
          }
        
    } catch (error) {
        console.log(error)
    }



}