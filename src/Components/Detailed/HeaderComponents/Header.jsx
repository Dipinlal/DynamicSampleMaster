import React, { useEffect, useState } from "react";
import DynamicInputFieldHeader from "./HeaderInputType";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CircularProgress from "@mui/material/CircularProgress"; // For showing a loading spinner
import { getAutocomplete1 } from "../../../apis/api";

function Header({
  headerData,
  triggerValidation,
  resetTriggerVAlidation,
  errorGlobal,
  handleFieldError,
  headerFormData,
  setheaderFormData,
  resetForm,
  setresetForm
}) {
  const theme = createTheme({
    components: {
      MuiTab: {
        // Make sure you have 'MuiTab' and not 'Tab' here
        styleOverrides: {
          root: {
            textTransform: "none", // Overrides the text transform to prevent uppercase
          },
        },
      },
    },
  });

  const [selectedHeaderMain, setselectedHeaderMain] = useState("Main");
  const [formData, setformData] = useState(headerFormData);
  const [tabValue, setTabValue] = useState(0);
  const [tabsWithFields, setTabsWithFields] = useState({});
  const [activeTab, setActiveTab] = useState(0);
  const [tabNames, setTabNames] = useState([]);
  const [tabData, settabData] = useState([]);
  const [loading, setloading] = useState(false);
  const [dataInitialized, setDataInitialized] = useState(false);
  const [menuListTotal, setmenuListTotal] = useState({});

  async function fetchmenuListData(iLinkTag, key1, fieldId, sType) {
    setloading(true);
    try {
      let response;
      if (sType == "Autocomplete") {
        // const existingValue = key1
        // const existingId = fieldId
        //   if (existingValue !== undefined) {

        //     response = await getAutocomplete1(iLinkTag,{ iType: 1, search: existingValue });
        //     } else {
        //       response = await getAutocomplete1(iLinkTag)
        //     }

        return;
      } else {
        response = await getAutocomplete1(iLinkTag);
      }

      if (response?.result) {
        const resultData = JSON.parse(response?.result);
        if (resultData.length > 0) {
          setmenuListTotal((prevData) => ({
            ...prevData,
            [key1]: resultData,
          }));
        } else {
          setmenuListTotal((prevData) => ({
            ...prevData,
            [key1]: [],
          }));
        }
      }
    } catch (error) {
      console.error("Failed to fetch menuListTotal :", error);
    } finally {
      setloading(false);
    }
  }

  // Asynchronous effect to fetch and process data
  useEffect(() => {
    async function loadData() {
      try {
        setloading(true);
        // Simulate async data fetching
        const processedData = await processHeaderData(headerData);
        setTabNames(Object.keys(processedData));
        settabData(processedData);
        headerData.map((field) => {
          if (field.sLinkApi && field.sLinkApi.trim() !== "") {
            fetchmenuListData(
              field.sLinkApi,
              field.sFieldName,
              field.sFieldId,
              field.sType
            );
          }
        });

        initializeFormData(headerData);
      } catch (error) {
        console.error("Error processing header data:", error);
      }
      setloading(false);
    }
    loadData();
  }, [headerData,resetForm]);

  // Simulated async function to process header data
  const processHeaderData = async (headerData) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const groupedData = headerData
          .filter((field) => field.bDisplayed)
          .sort((a, b) => a.iFieldOrder - b.iFieldOrder)
          .reduce((acc, field) => {
            const tabName = field.sTabName || "Default";
            if (!acc[tabName]) acc[tabName] = [];
            acc[tabName].push(field);
            return acc;
          }, {});
        resolve(groupedData);
      }, 1000); // simulate delay
    });
  };
  function initializeFormData(fields) {
    const initialData = fields.reduce((acc, field) => {
      // If formData already has a value for this field, use it. Otherwise, set to default or empty.

      if (field.sType == "Autocomplete") {
        const existingValue = headerFormData[field.sFieldName];
        const existingId = headerFormData[field.sFieldId];
        if (existingValue !== undefined) {
          acc[field.sFieldId] = existingId;
          acc[field.sFieldName] = existingValue;
        } else {
          acc[field.sFieldId] = null;
          acc[field.sFieldName] = null;
        }
      } else {
        acc[field.sFieldName] =
          headerFormData[field.sFieldName] ?? getDefaultValue(field);
      }
      return acc;
    }, {});
    setformData(initialData);
    setheaderFormData(initialData);
    setDataInitialized(true);
    localStorage.setItem("headerFormData", JSON.stringify(initialData));
    setresetForm(false)
  }
 

  function getDefaultValue(field) {
    let parsedValue;
    switch (field.sDatatype) {
      case "integer":
        parsedValue = parseInt(field.sDefaultValue, 10);
        return !isNaN(parsedValue) ? parsedValue : null;
      case "float":
        parsedValue = parseFloat(field.sDefaultValue);
        return !isNaN(parsedValue) ? parsedValue : null;
      case "number":
        parsedValue = parseFloat(field.sDefaultValue);
        return !isNaN(parsedValue) ? parsedValue : null;
      case "bool":
        const boolValue = parseInt(field.sDefaultValue, 10);
        return boolValue === 1 ? true : false;
      case "array":
        try {
          // Attempt to parse the string as JSON to convert it into an array
          const arrayValue = JSON.parse(field.sDefaultValue);
          // Check if the parsed value is indeed an array
          return Array.isArray(arrayValue) ? arrayValue : [];
        } catch (e) {
          // If there's an error during parsing, return an empty array
          return [];
        }
      // default:
      //   return field.sDefaultValue !== null ? field.sDefaultValue : "";
      default:
        return field.sDefaultValue;
    }
  }

  //for grouping
  // useEffect(() => {
  //   const groupedData = headerData
  //     .filter((field) => field.bDisplayed) // Consider only displayed fields
  //     .sort((a, b) => a.iFieldOrder - b.iFieldOrder) // Sort by field order
  //     .reduce((acc, field) => {
  //       // Group fields by sTabName
  //       const tabName = field.sTabName || 'Default'; // Handle fields with no sTabName
  //       if (!acc[tabName]) {
  //         acc[tabName] = [];
  //       }
  //       acc[tabName].push(field);
  //       return acc;
  //     }, {});

  //   setTabNames(Object.keys(groupedData)); // Set tab names for rendering tabs
  //   settabData(groupedData); // Set sorted and grouped fields for display
  // }, [headerData]);

  const handleTabChange = (event, newValue) => {
    if (!loading && dataInitialized) {
      setActiveTab(newValue);
      setloading(true);
      setTimeout(() => {
        // Let's assume data processing is done here.
        setloading(false);
      }, 1000);
    }

    // Set loading to true here to indicate data processing/loading is starting

    // Simulate or actually load data here. For now, I will simulate a delay to represent processing.
    else {
      setTimeout(() => {
        // Let's assume data processing is done here.
        setloading(false);
      }, 1000); // simulate data loading for 1 second
    }
  };

  //   useEffect(() => {
  //     if (headerData && Array.isArray(headerData)) {
  //         const newFormData = headerData.reduce((acc, curr) => {
  //           const existingValue = formData[curr.sFieldName];
  //           const existingId = formData[curr.sFieldId]
  //             if(curr.sType == "Autocomplete"){
  //               if (existingValue !== undefined) {

  //                 acc[curr.sFieldId] = existingId
  //                 acc[curr.sFieldName] = existingValue
  //                 } else {
  //                   acc[curr.sFieldId] = 0
  //                   acc[curr.sFieldName] = ""
  //                 }

  //             }

  //             else if (curr.sFieldName) {
  //               if (existingValue !== undefined) {
  //                 // If there's an existing value, preserve it
  //                 acc[curr.sFieldName] = existingValue;
  //             } else {
  //                 // Initialize field based on its data type
  // if (curr.sDefaultValue !== undefined) {
  //   // Handle default value based on the specified data type
  //   switch (curr.sDatatype) {
  //     case 'integer':
  //       // Parse sDefaultValue to integer and store as number
  //       acc[curr.sFieldName] = parseInt(curr.sDefaultValue, 10);
  //       break;
  //     case 'float':
  //       // Store sDefaultValue as is to preserve formatting like "0.00"
  //       acc[curr.sFieldName] = parseFloat(curr.sDefaultValue);
  //       break;
  //     case 'number':
  //       // Try to parse as float first, then decide if integer format is needed
  //       const parsedValue = parseFloat(curr.sDefaultValue);
  //       acc[curr.sFieldName] = Number.isInteger(parsedValue) ? parsedValue : curr.sDefaultValue;
  //       break;
  //     case 'bool':

  //         acc[curr.sFieldName] = parseInt(curr.sDefaultValue, 10);
  //         break;
  //     default:
  //       // For non-numeric types, use the default value directly
  //       acc[curr.sFieldName] = curr.sDefaultValue;
  //   }
  // } else {
  //   // Fallback for when there's no default value specified, ensuring numeric types get 0
  //   acc[curr.sFieldName] = (curr.sDatatype === 'number' || curr.sDatatype === 'integer' || curr.sDatatype === 'float') ? 0 : "";
  // }
  //             }
  //             }

  //             return acc;
  //         }, {});

  //         setformData(prevFormData => ({ ...prevFormData, ...newFormData }));
  //     }
  // }, [headerData]);

  const headerSelection = (value) => {
    setselectedHeaderMain(value);
  };

  // const HeaderInputValue = (key,value)=>{

  //     setformData({
  //         ...formData,
  //         [key]:value
  //     })

  // }
  const HeaderInputValue = (key, value, additionalValues = {}) => {
    setformData((prev) => ({
      ...prev,
      [key]: value,
      ...additionalValues, // Spread any additional values into the formData
    }));
  };
  useEffect(() => {
    const data = {
      ...formData,
    };

    setheaderFormData(data);
  }, [formData]);

  //  if (loading) {
  //     return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
  //         <CircularProgress />
  //     </div>;
  // }

  const tabHasErrors = (tabFields) => {
    return tabFields.some(field => errorGlobal[field.sFieldName]);
  };
  return (
    <ThemeProvider theme={theme}>
      <div className="CLTCS2">
        {/* <div className="CLTCS2D1">

      <div onClick={()=>headerSelection("Main")}  className={selectedHeaderMain === "Main"?"CLTCS2D1D1":"CLTCS2D1D2"}>Main</div>
      <div onClick={()=>headerSelection("Attachments")} className={selectedHeaderMain === "Attachments"?"CLTCS2D1D1":"CLTCS2D1D2"}>Attachments</div>

    </div> */}
        <Tabs
          sx={{ textTransform: "none" }}
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto" // `auto` will only show scroll buttons when needed
          allowScrollButtonsMobile
        >
          {tabNames.map((tabName, index) => (
            <Tab label={tabName} value={index} key={tabName} style={{
              color: tabHasErrors(tabData[tabName]) ? 'red' : 'inherit'
            }}/>
          ))}
        </Tabs>
        {selectedHeaderMain === "Main" && (
          <div style={{ marginTop: "8px" }}>
            {tabNames.map((tabName, index) => {
              // Check if the first item exists and if its sFieldName is 'attachments'
              const isAttachments =
                tabData[tabName] &&
                tabData[tabName][0] &&
                tabData[tabName][0].sType === "File";
              return (
                <div
                  key={tabName}
                  role="tabpanel"
                  hidden={activeTab !== index}
                  id={`tabpanel-${index}`}
                  aria-labelledby={`tab-${index}`}
                  className={
                    isAttachments
                      ? "fileInput-container"
                      : "headInput-container"
                  }
                >
                  {activeTab === index && loading ? (
                    <div
                      style={{
                        display: "flex",
                        position: "fixed",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "30vw",
                        width: "85%",
                        textAlign: "center",
                      }}
                    >
                      <CircularProgress />
                    </div>
                  ) : (
                    tabData[tabName] &&
                    activeTab === index &&
                    tabData[tabName].map((field) => (
                      <DynamicInputFieldHeader
                        //api fields
                        bAllowDateBefore={field.bAllowDateBefore} //done
                        bAllowSpecialChar={field.bAllowSpecialChar} //done for sDatatype text
                        bDisplayed={field.bDisplayed} //done used here in mapping
                        isMandatory={field.bMandatory} //done
                        bNegative={field.bNegative} //done gave to input have sDataType number
                        isDisabled={field.bReadOnly} //done
                        iFieldId={field.iFieldId}
                        iFieldOrder={field.iFieldOrder} //done used here in mapping
                        iLinkWithOtherMasters={field.iLinkWithOtherMasters}
                        iMasterId={field.iMasterId}
                        iMaxSize={field.iMaxLength} //done
                        type={field.sType} //done
                        sDefaultValue={field.sDefaultValue} //done but not tested
                        sErrorMsgConditions={field.sErrorMsgConditions} //done need more error condtions.
                        label={field.sFieldCaption} //done
                        key1={field.sFieldName} //done
                        sFieldId={field.sFieldId} //
                        sLanguageDisplayedWith={field.sLanguageDisplayedWith} //it is difficult with validation like checking special character.
                        iLinkTag={field.sLinkApi} //done
                        sTabName={field.sTabName}
                        sDatatype={field.sDatatype} //done
                        //others props
                        key={field.sFieldName}
                        formDataHeader={formData}
                        HeaderInputValue={HeaderInputValue}
                        isHeader="true"
                        triggerValidation={triggerValidation}
                        resetTriggerVAlidation={resetTriggerVAlidation}
                        onError={handleFieldError}
                        errorGlobal={errorGlobal}
                        menuList={menuListTotal[field.sFieldName] || []}
                      />
                    ))
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </ThemeProvider>
  );
}

export default Header;
