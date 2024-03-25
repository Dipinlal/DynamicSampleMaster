import React, { useEffect, useState } from 'react'
import DynamicInputFieldHeader from './HeaderInputType'

function Header({headerData,triggerValidation,handleFieldError,headerFormData,setheaderFormData}) {

    
   
    const [selectedHeaderMain, setselectedHeaderMain] = useState("Main")
    const [formData, setformData] = useState(headerFormData)
    

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
 
  // Reset errors when needed, such as on successful save or field value change
 
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
   useEffect(() => {
     const data = {
      ...formData
     }
     setheaderFormData(data)
   }, [formData])
   
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
       
      { headerData.sort((a, b) => a.iFieldOrder - b.iFieldOrder).map((field, index) => (
                 field.bDisplayed && ( 
                <DynamicInputFieldHeader

                    //api fields
                    bAllowDateBefore={field.bAllowDateBefore}//done
                    bAllowSpecialChar={field.bAllowSpecialChar}//done for sDatatype text
                    bDisplayed={field.bDisplayed} //done used here in mapping
                    isMandatory={field.bMandatory}//done
                    bNegative={field.bNegative}//done gave to input have sDataType number
                    isDisabled={field.bReadOnly}//done

                    iFieldId={field.iFieldId}
                    iFieldOrder={field.iFieldOrder}//done used here in mapping
                    iLinkWithOtherMasters={field.iLinkWithOtherMasters}
                    iMasterId={field.iMasterId}
                    iMaxSize={field.iMaxLength}//done

                    type={field.sType}//done
                    sDefaultValue={field.sDefaultValue}//done but not tested
                    sErrorMsgConditions={field.sErrorMsgConditions}//done need more error condtions.
                    label={field.sFieldCaption}//done
                    key1={field.sFieldName}//done
                    sLanguageDisplayedWith={field.sLanguageDisplayedWith}//it is difficult with validation like checking special character.    
                    iLinkTag={field.sLinkApi}//done
                    sTabName={field.sTabName}     
                    sDatatype={field.sDatatype}//done



                    //others props
                    key={field.sFieldName}
                    formDataHeader={formData}
                    HeaderInputValue={HeaderInputValue}
                    isHeader="true"
                    triggerValidation={triggerValidation}
                   
                    onError={handleFieldError}


                />
            )))}
      
      </div>
      
    }
    
    </div>
  )
}

export default Header