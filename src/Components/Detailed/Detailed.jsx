import React, { useEffect, useState } from "react";
import Navbar from "../../Components/Navbar/Navbar";
import Button from "@mui/material/Button";
import CloseIcon from "@mui/icons-material/Close";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import SaveIcon from '@mui/icons-material/Save';
import PrintIcon from '@mui/icons-material/Print';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import "./detailed.css"
import Header from "./HeaderComponents/Header";
import Body from "./BodyComponents/Body";
import { getFields } from "../../Apis/Api";

function Detailed() {


  const {iId} = useSelector((state)=>state.authState)

  const [headerData, setheaderData] = useState([])
  const [bodyData, setbodyData] = useState([])

 

    const navigate = useNavigate();
    const location = useLocation();

    const pageTitle = location.state?.pageTitle;
    const iTransId = location.state?.iTransid;
    const iDocType = location.state?.iDoctype;
    




   

      //select main and attachements
      

      //get document settings
      useEffect(() => {
        const fetchData = async () => {
          try {
            
           
       
            
            
         const response = await getFields()
            
       console.log(response);
       if(response.data.result){
        setheaderData(JSON.parse(response.data.result))   
       }
       else{
        setheaderData([])
       }
        
          
          } catch (error) {
            console.log(error);
          }
        };
        
          fetchData();
        
      
      }, []);
      //get details
      useEffect(() => {
        const fetchData = async () => {
          try {
            const config = {
              headers: {
                "Content-Type": "application/json",
              },
            };
           
            const iUser = iId;
            
            
            
            // const response = await getDetails({iTransId,iUser,iDocType})
            // // console.log(response)
            // const resultData = JSON.parse(response.data.ResultData)
           
            // console.log(resultData)
            
           
          
          } catch (error) {
            console.log(error);
          }
        };
        if(iTransId)
          fetchData();
        
          
        
      
      }, [iTransId,iId,iDocType]);
      


  return (
    <div className="CustomerListMain">
      <Navbar />
      <div className="CLMS1"></div>
      <div className="CLTableContainer">
        <div className="CLTCS1">
          <div>
            <h2 className="CLTCS1T1">{pageTitle}</h2>{" "}
          </div>
          {/* <div className="CLTCS1D2">
            <Button
              id="CLTCS1D2B1"
              onClick={handleNew}
              startIcon={
                <AddCircleOutlineIcon id="CLTCS1D2BI" className="CLTCS1D2B" />
              }
            >
              New
            </Button>
            <Button
              id="CLTCS1D2B2"
              onClick={handleSave}
              startIcon={<SaveIcon id="CLTCS1D2BI" className="CLTCS1D2B" />}
            >
              Save
            </Button>
            <Button
              id="CLTCS1D2B2"
              onClick={handlePrint}
              startIcon={<PrintIcon id="CLTCS1D2BI" className="CLTCS1D2B" />}
            >
              Print
            </Button>
            <Button
              id="CLTCS1D2B3"
              onClick={handleDelete}
              startIcon={
                <DeleteOutlineIcon id="CLTCS1D2BI" className="CLTCS1D2B" />
              }
            >
              Delete
            </Button>
            <Button
              id="CLTCS1D2B4"
              onClick={handleClose}
              startIcon={<ArrowBackIcon id="CLTCS1D2BI" className="CLTCS1D2B" />}
            >
              
            </Button>
            <Button
              id="CLTCS1D2B4"
              onClick={handleClose}
              startIcon={<ArrowForwardIcon id="CLTCS1D2BI" className="CLTCS1D2B" />}
            >
              
            </Button>
            <Button
              id="CLTCS1D2B4"
              onClick={handleClose}
              startIcon={<CloseIcon id="CLTCS1D2BI" className="CLTCS1D2B" />}
            >
              Close
            </Button>
          </div> */}
        </div>

        
        
      </div>
      <Header headerData={headerData}/>
      {/* <Body bodyData={bodyData}/> */}
     
    </div>
  )
}

export default Detailed