import React, { useEffect, useState } from 'react'
import DynamicInputFieldHeader from './HeaderInputType'

function Header({headerData}) {

    console.log(headerData);
    const [selectedHeaderMain, setselectedHeaderMain] = useState("Main")
    const [formData, setformData] = useState("")

    const fixedFields = [{
      sFieldName:"sDocNo",
      sFieldCaption:"Document No",
      iDataType:1,
      bMandatory:0,
      bReadOnly:1,
      iMaxSize:15,
      iLinkTag:0
   },
   {
    sFieldName:"sDate",
    sFieldCaption:"Date",
    iDataType:3,
    bMandatory:0,
    bReadOnly:0,
    iMaxSize:15,
    iLinkTag:0
 },
 {
  sFieldName:"Inventerory account",//not correct
  sFieldCaption:"Inventeroryaccount",
  iDataType:2,
  bMandatory:0,
  bReadOnly:0,
  iMaxSize:15,
  iLinkTag:0
},
{
  sFieldName:"Supplier account",//not correct
  sFieldCaption:"Supplier account",
  iDataType:2,
  bMandatory:0,
  bReadOnly:0,
  iMaxSize:15,
  iLinkTag:0
},
{
  sFieldName:"sDueDate",//not correct
  sFieldCaption:"Due Date",
  iDataType:3,
  bMandatory:0,
  bReadOnly:0,
  iMaxSize:15,
  iLinkTag:0
},
{
  sFieldName:"Vendorinvoiceno",//not correct
  sFieldCaption:"Vendor invoice no",
  iDataType:2,
  bMandatory:0,
  bReadOnly:0,
  iMaxSize:15,
  iLinkTag:0
},
{
  sFieldName:"sNarration",
  sFieldCaption:"Narration",
  iDataType:7,
  bMandatory:0,
  bReadOnly:0,
  iMaxSize:200,
  iLinkTag:0
},
  ]
    useEffect(() => {
      if (headerData && Array.isArray(headerData)) {
          const newFormData = headerData.reduce((acc, curr) => {
              if (curr.sFieldName) {
                  acc[curr.sFieldName] = "";
              }
              return acc;
          }, {});
          setformData(prevFormData => ({ ...prevFormData, ...newFormData }));
      }
  }, [headerData]);

    const headerSelection = (value)=>{
        setselectedHeaderMain(value)
    }

    const HeaderInputValue = (key,value)=>{
        setformData({
            ...formData,
            [key]:value
        })

    }
   console.log(formData);
  return (
    <div className="CLTCS2">
    {/* <div className="CLTCS2D1">

      <div onClick={()=>headerSelection("Main")}  className={selectedHeaderMain === "Main"?"CLTCS2D1D1":"CLTCS2D1D2"}>Main</div>
      <div onClick={()=>headerSelection("Attachments")} className={selectedHeaderMain === "Attachments"?"CLTCS2D1D1":"CLTCS2D1D2"}>Attachments</div>

    </div> */}
    {
      selectedHeaderMain ==="Main" &&
      <div className="headInput-container">

        {/* {
          fixedFields.map((field)=>(
            <DynamicInputFieldHeader
                    key={field.sFieldName}
                    label={field.sFieldCaption}
                    key1={field.sFieldName}
                    type={field.iDataType}
                    HeaderInputValue={HeaderInputValue}
                    isMandatory={field.bMandatory}
                    isDisabled={field.bReadOnly}
                    formDataHeader={formData}
                    iMaxSize={field.iMaxSize}
                    iLinkTag={field.iLinkTag}
                    isHeader="true"

                />
          ))
        } */}
       
      {headerData.map((field, index) => (
                <DynamicInputFieldHeader

                    //api fields
                    bAllowDateBefore={field.bAllowDateBefore}
                    bAllowSpecialChar={field.bAllowSpecialChar}
                    bDisplayed={field.bDisplayed} 
                    isMandatory={field.bMandatory}
                    bNegative={field.bNegative}
                    isDisabled={field.bReadOnly}

                    iFieldId={field.iFieldId}
                    iFieldOrder={field.iFieldOrder}
                    iLinkWithOtherMasters={field.iLinkWithOtherMasters}
                    iMasterId={field.iMasterId}
                    iMaxSize={field.iMaxLength}

                    type={field.sType}
                    sDefaultValue={field.sDefaultValue}
                    sErrorMsgConditions={field.sErrorMsgConditions}
                    label={field.sFieldCaption}
                    key1={field.sFieldName}
                    sLanguageDisplayedWith={field.sLanguageDisplayedWith}    
                    sLinkApi={field.sLinkApi}      
                    sTabName={field.sTabName}     
                    sDatatype={field.sDatatype}



                    //others props
                    key={field.sFieldName}
                    formDataHeader={formData}
                    HeaderInputValue={HeaderInputValue}
                    iLinkTag={field.sLinkApi}
                    isHeader="true"

                />
            ))}
      
      </div>
      
    }
    
    </div>
  )
}

export default Header