import React, { useEffect, useState } from 'react'
import DynamicInputFieldHeader from './HeaderInputType'
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

function Header({headerData,triggerValidation,resetTriggerVAlidation,handleFieldError,headerFormData,setheaderFormData}) {

    
   
    const [selectedHeaderMain, setselectedHeaderMain] = useState("Main")
    const [formData, setformData] = useState(headerFormData)
    const [tabValue, setTabValue] = useState(0);
    const [tabsWithFields, setTabsWithFields] = useState({});
    const [activeTab, setActiveTab] = useState(0);
    const [tabNames, setTabNames] = useState([]);
    const [tabData, settabData] = useState([])
   
  
   
    useEffect(() => {
      const groupedData = headerData
        .filter((field) => field.bDisplayed) // Consider only displayed fields
        .sort((a, b) => a.iFieldOrder - b.iFieldOrder) // Sort by field order
        .reduce((acc, field) => {
          // Group fields by sTabName
          const tabName = field.sTabName || 'Default'; // Handle fields with no sTabName
          if (!acc[tabName]) {
            acc[tabName] = [];
          }
          acc[tabName].push(field);
          return acc;
        }, {});
  
      setTabNames(Object.keys(groupedData)); // Set tab names for rendering tabs
      settabData(groupedData); // Set sorted and grouped fields for display
    }, [headerData]);
    const handleTabChange = (event, newValue) => {
      setActiveTab(newValue);
    };
  

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
            const existingValue = formData[curr.sFieldName];
              if (curr.sFieldName) {
                if (existingValue !== undefined) {
                  // If there's an existing value, preserve it
                  acc[curr.sFieldName] = existingValue;
              } else {
                  // Initialize field based on its data type
                  acc[curr.sFieldName] = curr.sDataType === 'number' ? 0 : "";
              }
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
    <Tabs value={activeTab} onChange={handleTabChange}>
        {tabNames.map((tabName, index) => (
          <Tab label={tabName} value={index} key={tabName} />
        ))}
      </Tabs>
    {
      selectedHeaderMain ==="Main" &&
      <div>

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
         {tabNames.map((tabName, index) => (
        <div
          key={tabName}
          role="tabpanel"
          hidden={activeTab !== index}
          id={`tabpanel-${index}`}
          aria-labelledby={`tab-${index}`}
          className="headInput-container"
        >
          {tabData[tabName] && activeTab === index && tabData[tabName].map((field) => (
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
                    resetTriggerVAlidation={resetTriggerVAlidation}
                    onError={handleFieldError}


                />
                ))}
                </div>
              ))}
      </div>
      
    }
    
    </div>
  )
}

export default Header