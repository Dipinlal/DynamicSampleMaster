import React, { useEffect, useState } from 'react';
import AutoComplete1 from './AutoComplete1';
import { TextField } from '@mui/material';
import CustomSelect1 from './Select1';




const DynamicInputFieldHeader = ({key1, type, HeaderInputValue, isMandatory, isDisabled,formDataHeader,label,iMaxSize,iLinkTag,isHeader,sDatatype
}) => {

    const [value, setValue] = useState('');
    const [formData, setformData] = useState({})
    const [dateValue, setDateValue] = useState('');
    
    const handleIntegerChange = (event) => {
        const val = event.target.value;
        // Allow only integer values
        if (val === '' || /^[0-9\b]+$/.test(val)) {
            setValue(val);
        }
        HeaderInputValue(key1,val)
    };
    const handleOtherChange = (event) => {
        const val = event.target.value;
       if(event.target.type === 'date'){
        setDateValue(event.target.value);
       }
        HeaderInputValue(key1,val)
    };

    useEffect(() => {
     
      const val=formData.sName
      HeaderInputValue(key1,val)


    }, [formData])
    
    switch (type) {
      case "Input":
        return (
          <TextField
          label={isHeader === "true" ? label : null}
          variant="outlined"
          fullWidth
          disabled={isDisabled === 1}
          InputProps={{
            style: {
              borderWidth: "1px",
              borderColor: "transparent",
              borderStyle: "solid",
              borderRadius: "10px",
              fontSize: "12px",
              height: "35px",
              paddingLeft: "6px",
              textAlign: "center",
            },
            inputProps: {
              maxLength: iMaxSize,
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
          onChange={handleIntegerChange}
        />
        
        );
        // case "Autocomplete":
        //   return (
        //     <CustomSelect1
        //       formData={formData}
        //       setFormData={setformData}
        //       width="92%"
        //       autoId="BoardSearch"
        //       autoLabel={isHeader === "true" ? label : null}
        //       isMandatory={isMandatory}
        //       disabled={isDisabled === 1 ? true : false}
        //       iMaxSize={iMaxSize}
        //       iLinkTag={iLinkTag}
        //       isHeader={isHeader}
        //       sFieldName={key1}

        //     />
        //   );  
        
        case "Autocomplete":
          return (
            <AutoComplete1
              formData={formData}
              setFormData={setformData}
              width="92%"
              autoId="BoardSearch"
              autoLabel={isHeader === "true" ? label : null}
              isMandatory={isMandatory}
              disabled={isDisabled === 1 ? true : false}
              iMaxSize={iMaxSize}
              iLinkTag={iLinkTag}
              isHeader={isHeader}
              sFieldName={key1}

            />
          );  
      
          
      default:
        return <p>Invalid input type</p>;
    }
};

export default DynamicInputFieldHeader;
