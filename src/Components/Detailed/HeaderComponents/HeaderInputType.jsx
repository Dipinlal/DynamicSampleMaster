import React, { useCallback, useEffect, useMemo, useState } from 'react';
import AutoComplete from './AutoComplete';
import AutoComplete1 from './AutoComplete1';
import { Checkbox, FormControlLabel, TextField } from '@mui/material';
import CustomSelect1 from './Select1';
import CheckBox from './CheckBox/CheckBox';
import Radio from './radio/Radio';




const DynamicInputFieldHeader = ({bNegative,bAllowSpecialChar,bAllowDateBefore,key1, type, HeaderInputValue, isMandatory, isDisabled,formDataHeader,label,iMaxSize,iLinkTag,isHeader,sDatatype,sDefaultValue,sErrorMsgConditions,
  triggerValidation,resetTriggerVAlidation,onError
}) => {

    const [value, setValue] = useState('');
    const [autoCompleteData, setAutoCompleteData] = useState({})//forAucomplete only
    const [dateValue, setDateValue] = useState('');
    const [isError, setError] = useState(false);
    const [checkBoxData, setcheckBoxData] = useState({})
    const [radioValue, setradioValue] = useState(null)
    const [checkedItems, setCheckedItems] = useState(formDataHeader[key1]);
 
 
    // const errorMessages = JSON.parse(sErrorMsgConditions)
    
    const handleError = (errorMessage) => {
      setError(errorMessage);
      onError(label, errorMessage); // Report error back to parent with field key and message
    };
    
    const handleChange = (e) => {
      let val = e.target.value;
      const inputLength = val.length;
     
      // Handle maximum size constraint
      if (iMaxSize && inputLength >= iMaxSize+1) {
          handleError(`Maximum length of ${iMaxSize} characters reached`);
          
          val = val.slice(0, iMaxSize); // Enforce max length
      } else {
          setError(false);
      }
      if (sDatatype === "number" && !bNegative && val.includes('-')) {
        setError(`Negative value not allowed`);
        val = val.replace('-', '');
    }else if (sDatatype === "text") {
      // if (!bAllowSpecialChar) {
      //     const hasSpecialChar = /[^a-zA-Z0-9 ]/.test(val);
      //     if (hasSpecialChar) {
      //         setError('Special characters are not allowed.');
      //     }
      //     else{
      //       setError("")
      //     }
      //     val = val.replace(/[^a-zA-Z0-9 ]/g, '');
      // }
      if (!bAllowSpecialChar) {
        // Define a list of disallowed characters
        const disallowedChars = [
          '`', '~', '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '-', '_',
          '=', '+', '[', '{', ']', '}', '\\', '|', ';', ':', "'", '"', ',', '<',
          '.', '>', '/', '?'
        ];
    
        // Check if the input value contains any disallowed character
        const hasSpecialChar = disallowedChars.some(char => val.includes(char));
    
        if (hasSpecialChar) {
          setError('Special characters are not allowed.');
        } 
    
        // Remove disallowed characters from the input value
        //val = val.split('').filter(char => !disallowedChars.includes(char)).join('');
      }
  } else if (sDatatype === "date") {
      setDateValue(val); 
  }

   
   
    HeaderInputValue(key1, val);
    };


 //Validate date
 const isRealDate = (dateStr) => {
  const date = new Date(dateStr);
  return !isNaN(date.getTime());
};

const isValidDateFormat = (dateStr) => {
  // Assuming ISO format for simplicity: YYYY-MM-DD
  return /^\d{4}-\d{2}-\d{2}$/.test(dateStr);
};

const doesDateExist = (dateStr) => {
  if (!isValidDateFormat(dateStr)) return false;

  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);

  // Check if the date is real by comparing the input parts to the Date object's parts
  // This catches situations like "2021-02-29" in a non-leap year
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
};


    const validateField = () => {
      let error = "";
      
      if (sDatatype === "date") {
        if (!doesDateExist(formDataHeader[key1])) {//added  formDataHeader[key1]) instead of datevalue
          error = "Invalid date";
        } else if (bAllowDateBefore !== null) {
              const today = new Date();
              const selectedDate = new Date(formDataHeader[key1]);//added  formDataHeader[key1]) instead of datevalue
              today.setHours(0, 0, 0, 0); // Normalize today's date for comparison

              // If dates before today are not allowed and the selected date is in the past
              if (!bAllowDateBefore && selectedDate < today) {
                  error = "Date cannot be in the past";
              }
          }
      }
      if (sDatatype === "text" && !bAllowSpecialChar) {
        // if (!bAllowSpecialChar) {
        //     const hasSpecialChar = /[^a-zA-Z0-9 ]/.test(val);
        //     if (hasSpecialChar) {
        //         setError('Special characters are not allowed.');
        //     }
        //     else{
        //       setError("")
        //     }
        //     val = val.replace(/[^a-zA-Z0-9 ]/g, '');
        // }
       
          // Define a list of disallowed characters
          const disallowedChars = [
            '`', '~', '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '-', '_',
            '=', '+', '[', '{', ']', '}', '\\', '|', ';', ':', "'", '"', ',', '<',
            '.', '>', '/', '?'
          ];
      
          // Check if the input value contains any disallowed character
          const hasSpecialChar = disallowedChars.some(char => formDataHeader[key1].includes(char));
      
          if (hasSpecialChar) {
            error = 'Special characters are not allowed.';
          }
          
         
        
    }
    
      // if (["When empty", "When Empty"].includes(sErrorMsgConditions) && (formDataHeader[key1] == "" ||formDataHeader[key1] == undefined)) {
      //     error = "Can't be empty";
      // }

      handleError(error);
      return error === ""; // Returns true if no error, false otherwise
  };
    const handleDateBlur = () => {
      validateField()
    
  };

    useEffect(() => {
     
      if(autoCompleteData && type ==="Autocomplete"){
      if(autoCompleteData?.iId){
        const val=autoCompleteData.iId
        HeaderInputValue(key1,val)
      }
      else{
        HeaderInputValue(key1,0);
        
        
      }
     }

    }, [autoCompleteData])
    useEffect(() => {
     
      if(type ==="CheckBoxes"){
        if(checkBoxData){
        HeaderInputValue(key1,checkBoxData[key1])
      }
      else{
        HeaderInputValue(key1,"")
        
      }
     }

    }, [checkBoxData])
    useEffect(() => {
     
      if(type ==="Radio"){
        if(radioValue){
        HeaderInputValue(key1,radioValue[key1])
      }
      else{
        HeaderInputValue(key1,0)
        
      }
    }

    }, [radioValue])
  

  
  useEffect(()=>{
    if(triggerValidation){
      validateField()
      resetTriggerVAlidation()
    }
   
  },[triggerValidation])
  const handleItemToggle = (e) => {
    const itemName = e.target.name; // Using the name attribute to identify the checkbox
    const isChecked = e.target.checked ? 1 : 0; // The checked status of the checkbox
    setCheckedItems({
        ...checkedItems,
        [itemName]: isChecked, // Update the state with the new checked status
    });
    HeaderInputValue(key1,isChecked)
}

 
    switch (type) {
      case "Input":
        return (
          <TextField
          label={isHeader === "true" ? label : null}
          error={isError} // Show error state based on isMaxSizeError
          helperText={isError} // Optional: display an error message
          variant="outlined"
          fullWidth
          disabled={isDisabled}
          InputProps={{
            style: {
              borderWidth: "1px",
              borderColor: "transparent",
              borderStyle: "solid",
              borderRadius: "10px",
              fontSize: "12px",
              height: "35px",
              paddingLeft: "0px",
              textAlign: "center",
            },
            inputProps: {
              maxLength: iMaxSize ? iMaxSize + 1 : 200,
            },
          }}
          InputLabelProps={{
            style: {
              fontSize: "16px",
              color: isMandatory ? "red" : "inherit",
            },
            shrink: sDatatype === "date" ? true : undefined, // Automatically shrink label for date type
          }}
          sx={{
            "& .MuiOutlinedInput-input": {
              padding: "8px 14px",
              transform: "translate(0px, 4px) scale(1)",
            },
            "& .MuiInputLabel-outlined": {
              transform: "translate(14px, 12px) scale(0.75)",
            },
            "& .MuiInputLabel-outlined.MuiInputLabel-shrink": {
              transform: "translate(14px, -6px) scale(0.75)",
              backgroundColor: "#fff",
              padding: "0px 2px",
            },
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                top: 0,
                borderTopLeftRadius: "10px",
                borderBottomLeftRadius: "10px",
                borderLeftColor: isMandatory ? "red" : "#ddd",
                borderLeftWidth: isMandatory ? "2px" : "1px",
              },
              "&.Mui-focused fieldset": {
                top: 0,
                borderTopLeftRadius: "10px",
                borderBottomLeftRadius: "10px",
                borderLeftColor: isMandatory ? "red" : "currentColor",
                borderLeftWidth: isMandatory ? "2px" : "1px",
              },
            },
            '& .MuiInputLabel-outlined.Mui-focused': {
              color: 'currentColor',
            },
            '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: 'currentColor',
            }
          }}
          type={sDatatype}
          value={formDataHeader[key1]}
          onChange={handleChange}
          onBlur={handleDateBlur}
        />
        
        );

        case "TextArea":
        return (
          <TextField
          label={isHeader === "true" ? label : null}
          error={isError} // Show error state based on isError
          helperText={isError} // Optional: display an error message
          variant="outlined"
          fullWidth
          disabled={isDisabled}
          multiline // Enable multiline input for text area functionality
          rows={2} // Minimum number of visible rows
          InputProps={{
            style: {
              borderWidth: "1px",
              borderColor: "transparent",
              borderStyle: "solid",
              borderRadius: "10px",
              fontSize: "12px",
              height: "auto", // Adjusted for text area
              paddingLeft: "0px",
              textAlign: "center",
            },
            inputProps: {
              maxLength: iMaxSize ? iMaxSize + 1 : 200,
            },
          }}
          InputLabelProps={{
            style: {
              fontSize: "16px",
              color: isMandatory ? "red" : "inherit",
            },
            shrink: sDatatype === "date" ? true : undefined, // Automatically shrink label for date type
          }}
          sx={{
            "& .MuiOutlinedInput-input": {
              padding: "8px 14px",
              // Removed transform for better text area support
            },
            "& .MuiInputLabel-outlined": {
              transform: "translate(14px, 12px) scale(0.75)",
            },
            "& .MuiInputLabel-outlined.MuiInputLabel-shrink": {
              transform: "translate(14px, -6px) scale(0.75)",
              backgroundColor: "#fff",
              padding: "0px 2px",
            },
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                top: 0,
                borderTopLeftRadius: "10px",
                borderBottomLeftRadius: "10px",
                borderLeftColor: isMandatory ? "red" : "#ddd",
                borderLeftWidth: isMandatory ? "2px" : "1px",
              },
              "&.Mui-focused fieldset": {
                borderTopLeftRadius: "10px",
                borderBottomLeftRadius: "10px",
                borderLeftColor: isMandatory ? "red" : "currentColor",
                borderLeftWidth: isMandatory ? "2px" : "1px",
              },
            },
            '& .MuiInputLabel-outlined.Mui-focused': {
              color: 'currentColor',
            },
            '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: 'currentColor',
            }
          }}
          type="textarea" // This prop is not necessary since `multiline` is used for text area functionality
          value={formDataHeader[key1]}
          onChange={handleChange}
          onBlur={handleDateBlur}
        />
        
        
        );
        
        case "Autocomplete":
          return (
            <AutoComplete1
              formData={autoCompleteData}
              setFormData={setAutoCompleteData}
              width="92%"
              autoId="BoardSearch"
              autoLabel={isHeader === "true" ? label : null}
              isMandatory={isMandatory}
              disabled={isDisabled}
              iMaxSize={iMaxSize}
              iLinkTag={iLinkTag}
              isHeader={isHeader}
              sFieldName={key1}
              formDataHeader={formDataHeader}
              key1={key1}
              

            />
          );  

        case "CheckBoxes":
          return(
            <CheckBox
            iLinkTag={iLinkTag}
            sFieldName={key1}
            label={label}
            isMandatory={isMandatory}
            checkBoxData={checkBoxData}
            setcheckBoxData={setcheckBoxData}
            formDataHeader={formDataHeader}
            key1={key1}
            disabled={isDisabled}
            />
          )
      case "Radio":
        return(
          <Radio
          iLinkTag={iLinkTag}
          sFieldName={key1}
          label={label}
          isMandatory={isMandatory}
          radioValue={radioValue}
          setradioValue={setradioValue}
          formDataHeader={formDataHeader}
          key1={key1}
          disabled={isDisabled}
          />
        )
        case "CheckBox":
        return(
          <FormControlLabel
          control={
            <Checkbox
             checked={formDataHeader[key1] === 1} // Using !! to ensure it's always a boolean
             onChange={handleItemToggle}
             disabled={isDisabled}
             name={key1}
             

             
            />
          }
          label={
            <span style={{ fontSize: "12px", padding: "0px" }}>
             {label}
            </span>
          }
        />
        )
          
      default:
        return null;
    }
};

export default DynamicInputFieldHeader;
