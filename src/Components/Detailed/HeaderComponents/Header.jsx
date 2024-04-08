import React, { useEffect, useState } from 'react'
import DynamicInputFieldHeader from './HeaderInputType'
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

function Header({headerData,triggerValidation,resetTriggerVAlidation,errorGlobal,handleFieldError,headerFormData,setheaderFormData}) {

    
   
    const [selectedHeaderMain, setselectedHeaderMain] = useState("Main")
    const [formData, setformData] = useState(headerFormData)
    const [tabValue, setTabValue] = useState(0);
    const [tabsWithFields, setTabsWithFields] = useState({});
    const [activeTab, setActiveTab] = useState(0);
    const [tabNames, setTabNames] = useState([]);
    const [tabData, settabData] = useState([])
    
  
    //for grouping
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
  

   
 
  // Reset errors when needed, such as on successful save or field value change
 
    useEffect(() => {
      if (headerData && Array.isArray(headerData)) {
          const newFormData = headerData.reduce((acc, curr) => {
            const existingValue = formData[curr.sFieldName];
            const existingId = formData[curr.sFieldId]
              if(curr.sType == "Autocomplete"){
                if (existingValue !== undefined) {

                  acc[curr.sFieldId] = existingId
                  acc[curr.sFieldName] = existingValue
                  } else { 
                    acc[curr.sFieldId] = 0
                    acc[curr.sFieldName] = ""
                  }
                
                
              }
              
              else if (curr.sFieldName) {
                if (existingValue !== undefined) {
                  // If there's an existing value, preserve it
                  acc[curr.sFieldName] = existingValue;
              } else {
                  // Initialize field based on its data type
  if (curr.sDefaultValue !== undefined) {
    // Handle default value based on the specified data type
    switch (curr.sDatatype) {
      case 'integer':
        // Parse sDefaultValue to integer and store as number
        acc[curr.sFieldName] = parseInt(curr.sDefaultValue, 10);
        break;
      case 'float':
        // Store sDefaultValue as is to preserve formatting like "0.00"
        acc[curr.sFieldName] = parseFloat(curr.sDefaultValue);
        break;
      case 'number':
        // Try to parse as float first, then decide if integer format is needed
        const parsedValue = parseFloat(curr.sDefaultValue);
        acc[curr.sFieldName] = Number.isInteger(parsedValue) ? parsedValue : curr.sDefaultValue;
        break;
      default:
        // For non-numeric types, use the default value directly
        acc[curr.sFieldName] = curr.sDefaultValue;
    }
  } else {
    // Fallback for when there's no default value specified, ensuring numeric types get 0
    acc[curr.sFieldName] = (curr.sDatatype === 'number' || curr.sDatatype === 'integer' || curr.sDatatype === 'float') ? 0 : "";
  }
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

    // const HeaderInputValue = (key,value)=>{
      
    //     setformData({
    //         ...formData,
    //         [key]:value
    //     })

    // }
    const HeaderInputValue = (key, value, additionalValues = {}) => {console.log(key, value);
      setformData(prev => ({
          ...prev,
          [key]: value,
          ...additionalValues // Spread any additional values into the formData
      }));
  };
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
                    sFieldId={field.sFieldId}//
                    

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
                    errorGlobal={errorGlobal}


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