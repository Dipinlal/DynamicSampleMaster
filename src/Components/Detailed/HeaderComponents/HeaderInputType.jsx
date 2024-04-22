import React, { useCallback, useEffect, useMemo, useState } from 'react';
import AutoComplete from './AutoComplete';
import AutoComplete1 from './AutoComplete1';
import { Checkbox, FormControlLabel, TextField, Typography } from '@mui/material';
import CustomSelect1 from './Select1';
import CheckBox from './CheckBox/CheckBox';
import Radio from './radio/Radio';
import Files from './files/Files';




const DynamicInputFieldHeader = ({bNegative,bAllowSpecialChar,bAllowDateBefore,key1,sFieldId, type, HeaderInputValue, isMandatory, isDisabled,formDataHeader,label,iMaxSize,iLinkTag,isHeader,sDatatype,sDefaultValue,sErrorMsgConditions,
  triggerValidation,resetTriggerVAlidation,onError,errorGlobal
}) => {
  const [autoCompleteData, setAutoCompleteData] = useState(null); //forAucomplete only
  const [files, setfiles] = useState(null);

  const [checkBoxData, setcheckBoxData] = useState({}); //multiple check
  const [radioValue, setradioValue] = useState(0);
  const [checkedItems, setCheckedItems] = useState({}); //single check
  const [fieldErrors, setFieldErrors] = useState(errorGlobal || {});

  //setting parent data to child
  useEffect(() => {
    if (type === "Autocomplete")
      setAutoCompleteData({
        sName: formDataHeader[key1],
        iId: formDataHeader[`${sFieldId}`],
      });
  }, []);
  useEffect(() => {
    if (type === "CheckBoxes")
      setcheckBoxData({ [key1]: formDataHeader[key1] });
  }, []);
  useEffect(() => {
    //single check
    if (type === "CheckBox") {
      setCheckedItems({ [key1]: formDataHeader[key1] });
    }
  }, []);
  useEffect(() => {
    if (type === "Radio") setradioValue(formDataHeader[key1]);
  }, []);
  useEffect(() => {
    if (type === "File") setfiles(formDataHeader[key1]);
  }, []);



  // Setting error
  const handleError = (errorMessage) => {
    setFieldErrors((prevErrors) => ({
      ...prevErrors,
      [key1]: errorMessage,
    }));

    // return error to parent to store in errorGlobal
    if (onError) {
      onError(key1, errorMessage);
    }
  };
  const clearFieldError = (key) => {
    setFieldErrors((prevErrors) => ({
      ...prevErrors,
      [key]: "",
    }));
  };

  //Date format check

  const isValidDateFormat = (dateStr) => {
    // Assuming ISO format for simplicity: YYYY-MM-DD
    return /^\d{4}-\d{2}-\d{2}$/.test(dateStr);
  };

  const doesDateExist = (dateStr) => {
    if (!isValidDateFormat(dateStr)) return false;

    const [year, month, day] = dateStr.split("-").map(Number);
    const date = new Date(year, month - 1, day);

    // Check if the date is real by comparing the input parts to the Date object's parts
    // This catches situations like "2021-02-29" in a non-leap year
    return (
      date.getFullYear() === year &&
      date.getMonth() === month - 1 &&
      date.getDate() === day
    );
  };

  //Extra validation
  const validateField = (val) => {
    let error = "";
    // let valueAsString = val == null ? '' : val.toString();

    if (sDatatype === "date") {
      if (formDataHeader[key1] && !doesDateExist(formDataHeader[key1])) {
        //added  formDataHeader[key1]) instead of datevalue and check only for valid entry not empty date. empty date allowed. if mandatory check using isMandatory
        error = "Invalid date";
      }
    }
    //   else if (sDatatype === "text" && !bAllowSpecialChar) {

    //       const disallowedChars = [
    //         '`', '~', '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '-', '_',
    //         '=', '+', '[', '{', ']', '}', '\\', '|', ';', ':', "'", '"', ',', '<',
    //         '.', '>', '/', '?'
    //       ];

    //       // Check if the input value contains any disallowed character
    //       const hasSpecialChar = disallowedChars.some(char => formDataHeader[key1].includes(char));

    //       if (hasSpecialChar) {
    //         error = 'Special characters are not allowed.';
    //       }

    // }
    //      // Number validation
    //      if (sDatatype === "number" && !bNegative && valueAsString.startsWith('-')) {
    //       error = 'Negative value not allowed';
    //       valueAsString = valueAsString.replace('-', '');
    //   }
    //    // Integer validation
    //    else if (sDatatype === "integer") {
    //       // First, check if negative values are not allowed but a negative sign is attempted
    //   if (!bNegative && valueAsString.startsWith('-')) {
    //     error =`Negative value not allowed`;
    //     // Optionally, you might want to remove the negative sign or leave it to show the error
    //     val = valueAsString.replace('-', ''); // Remove the negative sign if you don't want it to appear at all
    //   }

    //   // Then, allow only digits (and negative sign if bNegative is true)
    //   val = bNegative ? valueAsString.replace(/[^0-9-]/g, '') : valueAsString.replace(/[^0-9]/g, '');

    //   const parsedInt = parseInt(valueAsString, 10);
    //   if (!isNaN(parsedInt)) {
    //     val = parsedInt;
    //   } else if (val !== '-' && bNegative) { // Allow a standalone "-" if negatives are allowed
    //     val = null; // Set to some default value if parsing fails
    //   }
    // }

    //   // Float validation
    //   else if (sDatatype === "float") {
    //       // Allow numbers with decimal points, remove non-numeric characters except for a single decimal point
    //   if (!bNegative && valueAsString.startsWith('-')) {
    //     error =`Negative value not allowed`;
    //     val = valueAsString.replace('-', '');
    //   }
    //   // Replace anything that's not a number or more than one decimal point
    //   let decimalCount = 0;
    //   val = valueAsString.split('').filter((char) => {
    //     if (char === '.') {
    //       decimalCount += 1;
    //       return decimalCount <= 1; // Allow only one decimal point
    //     }
    //     return /[0-9]/.test(char);
    //   }).join('');
    // }

    return { error, val }; // Returns true if no error, false otherwise
  };

  //Main validation
  const handleValidation = (inputValue) => {
    let errorMessage = "";
    let selectedDate = "";
    let newInputvalue = inputValue;
    const today = new Date();
    if (sDatatype == "date") {
      selectedDate = new Date(inputValue); //added  formDataHeader[key1]) instead of datevalue
      selectedDate.setHours(0, 0, 0, 0);
    }

    today.setHours(0, 0, 0, 0); // Normalize today's date for comparison

    if (sErrorMsgConditions) {
      try {
        const conditions = JSON.parse(sErrorMsgConditions);

        for (const condition of conditions) {
          switch (condition.errorcondition) {
            case "Empty":
              if (
                inputValue === undefined ||
                inputValue === null ||
                inputValue == false ||
                inputValue === 0 ||
                (typeof inputValue === "string" && !inputValue.trim())
              ) {
                errorMessage = condition.message;
              }
              break;
            case "maxlength":
              if (inputValue.length > iMaxSize) {
                errorMessage = condition.message;
                newInputvalue = inputValue.slice(0, iMaxSize);
              }
              break;
            case "Before":
              // Assuming inputValue is a date string in the format 'YYYY-MM-DD'
              if (new Date(selectedDate) < today) {
                errorMessage = condition.message;
              }
              break;
            case "After":
              if (new Date(selectedDate) > new Date(today)) {
                errorMessage = condition.message;
              }
              break;
            case "File Required":
              if (!(inputValue.length > 0)) {
                errorMessage = condition.message;
              }
              break;

            default:
              break;
          }
          // If any error was found, break the loop
          if (errorMessage) break;
        }
      } catch (e) {
        console.error("Error parsing sErrorMsgConditions:", e);
        // Handle error or set a default error message
      }
    }

    const response = validateField(inputValue); //extra validation like invalid date
    const { error, val } = response;

    if (error) {
      errorMessage = error;
    }

    newInputvalue = val;

    handleError(errorMessage);
    return newInputvalue;
  };


  //Autocomple,checkbox,radio,checkboxes validation. fields other than input
  const handleValidationAutocomplete = (inputValue) => {
    let errorMessage = "";


    if (sErrorMsgConditions) {
      try {
        const conditions = JSON.parse(sErrorMsgConditions);

        for (const condition of conditions) {
          switch (condition.errorcondition) {
            case "Empty":
              if (
                inputValue === undefined ||
                inputValue === null ||
                inputValue == false ||
                inputValue === 0 ||
                (typeof inputValue === "string" && !inputValue.trim()) ||
                inputValue == []
              ) {
                errorMessage = condition.message;
              }
              break;
            case "maxlength":
              if (inputValue.length > iMaxSize) {
                errorMessage = condition.message;
              }
              break;
            case "File Required":
              if (!(inputValue.length > 0)) {
                errorMessage = condition.message;
              }
              break;

             
            default:
              break;
          }
          // If any error was found, break the loop
          if (errorMessage) break;
        }
      } catch (e) {
        console.error("Error parsing sErrorMsgConditions:", e);
        // Handle error or set a default error message
      }
    }

    handleError(errorMessage);
  };

  // Each value change
  const handleChange = (e) => {
    const { value } = e.target;
    let validatedValue = value;
    switch (sDatatype) {
      case "integer":
        // For integers: Allow only digits, and if bNegative is true, allow a negative sign.
        if (bNegative) {
          // Allow negative numbers and digits
          validatedValue = value
            .replace(/[^0-9-]/g, "")
            .replace(/-+/, "-")
            .replace(/(^-)|-+/g, "$1");
        } else {
          // Allow only positive numbers
          validatedValue = value.replace(/[^0-9]/g, "");
        }
        break;
      case "number":
      case "float":
        // For floats or general numbers: Allow only digits, one decimal point, and optionally a negative sign.
        if (bNegative) {
          // Allow negative numbers, digits, and one decimal point
          validatedValue = value
            .replace(/[^0-9.-]/g, "")
            .replace(/(\..*)\./g, "$1")
            .replace(/-+/, "-")
            .replace(/(^-)|-+/g, "$1");
        } else {
          // Allow only positive numbers and one decimal point
          validatedValue = value
            .replace(/[^0-9.]/g, "")
            .replace(/(\..*)\./g, "$1");
        }
        break;
      case "text":
        // For text, there are no restrictions apart from special characters if not allowed
        if (!bAllowSpecialChar) {
          validatedValue = value.replace(/[^a-zA-Z0-9 ]/g, ""); // Adjust based on what special characters are considered
        }
        break;
      default:
        validatedValue = value;
        break;
    }

    const newVal = handleValidation(validatedValue);

    //   if (sDatatype === "number" && !bNegative && val.includes('-')) {
    //     handleError(`Negative value not allowed`);
    //     val = val.replace('-', '');
    // }
    // else if (sDatatype === "integer") {
    //   // First, check if negative values are not allowed but a negative sign is attempted
    //   if (!bNegative && val.startsWith('-')) {
    //     handleError(`Negative value not allowed`);
    //     // Optionally, you might want to remove the negative sign or leave it to show the error
    //     val = val.replace('-', ''); // Remove the negative sign if you don't want it to appear at all
    //   }

    //   // Then, allow only digits (and negative sign if bNegative is true)
    //   val = bNegative ? val.replace(/[^0-9-]/g, '') : val.replace(/[^0-9]/g, '');

    //   const parsedInt = parseInt(val, 10);
    //   if (!isNaN(parsedInt)) {
    //     val = parsedInt;
    //   } else if (val !== '-' && bNegative) { // Allow a standalone "-" if negatives are allowed
    //     val = 0; // Set to some default value if parsing fails
    //   }
    // }else if (sDatatype === "float") {
    //   // Allow numbers with decimal points, remove non-numeric characters except for a single decimal point
    //   if (!bNegative && val.startsWith('-')) {
    //     handleError(`Negative value not allowed`);
    //     val = val.replace('-', '');
    //   }
    //   // Replace anything that's not a number or more than one decimal point
    //   let decimalCount = 0;
    //   val = val.split('').filter((char) => {
    //     if (char === '.') {
    //       decimalCount += 1;
    //       return decimalCount <= 1; // Allow only one decimal point
    //     }
    //     return /[0-9]/.test(char);
    //   }).join('');
    // }

    HeaderInputValue(key1, newVal);
  };

  // Additional checking and conversion after typping
  const handleBlur = (e) => {
    let val = e.target.value;
    const newVal = handleValidation(val); // To validate after value has entered

    // to convert number in string to integer or float.onchange number comes in string, so converted here to required format
    let numericalValue;
    if (sDatatype === "integer") {
      //for making integer
      numericalValue = parseInt(formDataHeader[key1], 10);
      if (isNaN(numericalValue)) numericalValue = null; // Fallback to 0 if the conversion fails
      HeaderInputValue(key1, numericalValue);
    } else if (sDatatype === "float") {
      //for making float
      numericalValue = parseFloat(formDataHeader[key1]);
      if (isNaN(numericalValue)) numericalValue = null; // Fallback to 0.0 if the conversion fails
      HeaderInputValue(key1, numericalValue);
    } else {
      HeaderInputValue(key1, newVal);
    }
  };

  //handle autocomplete
  useEffect(() => {
    if (autoCompleteData && type === "Autocomplete") {
      // handleValidationAutocomplete(autoCompleteData?.sName)
      if (autoCompleteData?.sName) {
        const name = autoCompleteData?.sName;
        const id = autoCompleteData?.iId;

        const additionalValues = {
          [`${sFieldId}`]: id,
          // Add as many other key-value pairs as needed
        };
        HeaderInputValue(key1, name, additionalValues);
      } else {
        const additionalValues = {
          //[`${sFieldId}`]: formDataHeader[`${sFieldId}`],
          [`${sFieldId}`]: null,
          // Add as many other key-value pairs as needed
        };
        //HeaderInputValue(key1,formDataHeader[key1],additionalValues);
        HeaderInputValue(key1, null, additionalValues);
      }
    }
  }, [autoCompleteData]);

  // handle checkbox
  useEffect(() => {
    if (type === "CheckBoxes") {
      if (checkBoxData[key1]) {
        HeaderInputValue(key1, checkBoxData[key1]);
      } else {
        //HeaderInputValue(key1,formDataHeader[key1])
        HeaderInputValue(key1, []);
      }
    }
  }, [checkBoxData]);

  //handle radio
  useEffect(() => {
    if (type === "Radio") {
      if (radioValue) {
        // handleValidationAutocomplete(radioValue[key1])
        HeaderInputValue(key1, radioValue);
      } else {
        // HeaderInputValue(key1,formDataHeader[key1])
        HeaderInputValue(key1, 0);
      }
    }
  }, [radioValue]);

  //handle files
  useEffect(() => {
    if (type === "File") {
      if (files) {
        // handleValidationAutocomplete(radioValue[key1])
        HeaderInputValue(key1, files);
      } else {
        HeaderInputValue(key1, []);
      }
    }
  }, [files]);

  // To validate on saving
  useEffect(() => {
    if (triggerValidation) {
      handleValidation(formDataHeader[key1]);
      resetTriggerVAlidation();
    }
  }, [triggerValidation]);

  //handle single checkbox
  const handleItemToggle = (e) => {
    const itemName = e.target.name; // Using the name attribute to identify the checkbox
    const isChecked = e.target.checked ? true : false; // The checked status of the checkbox
    setCheckedItems({
      [itemName]: isChecked, // Update the state with the new checked status
    });
    handleValidationAutocomplete(isChecked);
    HeaderInputValue(key1, isChecked);
  };

  useEffect(() => {
    if (type === "CheckBox" && triggerValidation) {
      handleValidationAutocomplete(checkedItems[key1]);
    } else if (
      autoCompleteData &&
      type === "Autocomplete" &&
      (triggerValidation || formDataHeader[key1] !== autoCompleteData.sName)
    ) {
      handleValidationAutocomplete(autoCompleteData?.sName);
    } else if (
      type === "CheckBoxes" && checkBoxData[key1] &&
      (triggerValidation ||
        formDataHeader[key1]?.length !== checkBoxData[key1]?.length)
    ) {
      handleValidationAutocomplete(checkBoxData[key1]);
    } else if (
      type === "Radio" &&
      radioValue &&
      (triggerValidation || formDataHeader[key1] != radioValue)
    ) {
      handleValidationAutocomplete(radioValue);
    }
    else if (
      type === "File" &&
      files &&
      (triggerValidation || formDataHeader[key1] != files)
    ) {
      handleValidationAutocomplete(files);
    }
  }, [
    checkedItems,
    autoCompleteData,
    radioValue,
    checkBoxData,
    triggerValidation,
  ]);

  switch (type) {
    case "Input":
      return (
        <TextField
          label={isHeader === "true" ? label : null}
          error={!!fieldErrors[key1]} // Use the error state for this field
          helperText={fieldErrors[key1]} // Display the error message
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
              maxLength: iMaxSize ? iMaxSize : 200,
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
            "& .MuiInputLabel-outlined.Mui-focused": {
              color: "currentColor",
            },
            "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
              {
                borderColor: "currentColor",
              },
          }}
          type={sDatatype}
          value={formDataHeader[key1]}
          onChange={handleChange}
          onBlur={handleBlur}
        />
      );

    case "TextArea":
      return (
        <TextField
          label={isHeader === "true" ? label : null}
          error={!!fieldErrors[key1]} // Use the error state for this field
          helperText={fieldErrors[key1]} // Display the error message
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
            "& .MuiInputLabel-outlined.Mui-focused": {
              color: "currentColor",
            },
            "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
              {
                borderColor: "currentColor",
              },
          }}
          type="textarea" // This prop is not necessary since `multiline` is used for text area functionality
          value={formDataHeader[key1]}
          onChange={handleChange}
          onBlur={handleBlur}
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
          sFieldId={sFieldId}
          triggerValidation={triggerValidation}
          resetTriggerVAlidation={resetTriggerVAlidation}
          fieldErrors={fieldErrors}
          setFieldErrors={setFieldErrors}
          sErrorMsgConditions={sErrorMsgConditions}
        />
      );

    case "CheckBoxes":
      return (
        <div style={{ marginBottom: "16px" }}>
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
          {fieldErrors[key1] && (
            <div style={{ color: "#D32F2F" }}>
              <Typography sx={{ fontSize: "12px" }}>
                {fieldErrors[key1]}
              </Typography>
            </div>
          )}
        </div>
      );
    case "Radio":
      return (
        <div style={{ marginBottom: "16px" }}>
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
          {fieldErrors[key1] && (
            <div style={{ color: "#D32F2F" }}>
              <Typography sx={{ fontSize: "12px" }}>
                {fieldErrors[key1]}
              </Typography>
            </div>
          )}
        </div>
      );
    case "CheckBox":
      return (
        <div style={{ marginBottom: "16px" }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={formDataHeader[key1] == true} // Using !! to ensure it's always a boolean
                onChange={handleItemToggle}
                disabled={isDisabled}
                name={key1}
                sx={{
                  color: isMandatory ? "red" : "default", // default is typically grey
                }}
              />
            }
            label={
              <span style={{ fontSize: "12px", padding: "0px" }}>{label}</span>
            }
          />
          {fieldErrors[key1] && (
            <div style={{ color: "#D32F2F" }}>
              <Typography sx={{ fontSize: "12px" }}>
                {fieldErrors[key1]}
              </Typography>
            </div>
          )}
        </div>
      );
    case "File":
      return (
        <Files
          sFieldName={key1}
          label={label}
          isMandatory={isMandatory}
          formDataHeader={formDataHeader}
          key1={key1}
          disabled={isDisabled}
          setfiles={setfiles}
          fieldErrors={fieldErrors}
          setFieldErrors={setFieldErrors}
          sErrorMsgConditions={sErrorMsgConditions}
          handleError={handleError}
        />
      );

    default:
      return null;
  }
};

export default DynamicInputFieldHeader;
