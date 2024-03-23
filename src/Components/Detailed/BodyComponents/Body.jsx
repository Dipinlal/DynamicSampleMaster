import React, { useEffect, useState } from 'react'

import MuiEditableTable from './BodyTable';

function Body({bodyData}) {

    
    const [selectedHeaderMain, setselectedHeaderMain] = useState("Main")
    const [formData, setformData] = useState({
        
    })

    const fixedFields = [{
      sFieldName:"iItem",
      sFieldCaption:"item",
      iDataType:5,
      bMandatory:0,
      bReadOnly:0,
      iMaxSize:15,
      iLinkTag:0
   },
   {
    sFieldName:"description",
    sFieldCaption:"Description",
    iDataType:2,
    bMandatory:0,
    bReadOnly:0,
    iMaxSize:15,
    iLinkTag:0
 },
 {
  sFieldName:"iUnit",
  sFieldCaption:"Unit",
  iDataType:2,
  bMandatory:0,
  bReadOnly:0,
  iMaxSize:15,
  iLinkTag:0
},
{
  sFieldName:"nQty",
  sFieldCaption:"Quantity",
  iDataType:4,
  bMandatory:0,
  bReadOnly:0,
  iMaxSize:15,
  iLinkTag:0
},
{
  sFieldName:"nRate",
  sFieldCaption:"Rate",
  iDataType:4,
  bMandatory:0,
  bReadOnly:0,
  iMaxSize:15,
  iLinkTag:0
},
{
  sFieldName:"nGross",
  sFieldCaption:"Gross",
  iDataType:2,
  bMandatory:0,
  bReadOnly:0,
  iMaxSize:15,
  iLinkTag:0
},
{
  sFieldName:"sRemarks",
  sFieldCaption:"Remarks",
  iDataType:7,
  bMandatory:0,
  bReadOnly:0,
  iMaxSize:200,
  iLinkTag:0
},
  ]
  
const combinedBody = [...bodyData,...fixedFields]
 
  return (
    <div className="BodyMain">
    {/* <div className="CLTCS2D1">

      <div onClick={()=>headerSelection("Main")}  className={selectedHeaderMain === "Main"?"CLTCS2D1D1":"CLTCS2D1D2"}>Main</div>
      <div onClick={()=>headerSelection("Attachments")} className={selectedHeaderMain === "Attachments"?"CLTCS2D1D1":"CLTCS2D1D2"}>Attachments</div>

    </div> */}
    {
      selectedHeaderMain ==="Main" &&
      <div className="body-container">
       
      {
        <MuiEditableTable bodyData={combinedBody}/>
      }
      
      </div>
      
    }
    
    </div>
  )
}

export default Body